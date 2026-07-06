import '../polyfills';
import { resolve } from '@aurelia/kernel';
import { BindingMode, bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-date-input.css';
import template from './au-date-input.html';

let dateInputId = 0;

type SegmentType = 'day' | 'month' | 'year';

interface SegmentDef {
    type: SegmentType;
    literal: string;
    placeholder: string;
    ariaLabel: string;
    size: number;
}

interface CalendarCell {
    day: number;
    iso: string;
    disabled: boolean;
    selected: boolean;
    today: boolean;
}

const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const SEGMENT_TYPES: SegmentType[] = ['day', 'month', 'year'];

function pad(value: number, length: number): string {
    return String(value).padStart(length, '0');
}

function toIso(year: number, month: number, day: number): string {
    return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
}

function isRealDate(year: number, month: number, day: number): boolean {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day) || year < 1) {
        return false;
    }
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function segmentDef(type: SegmentType): SegmentDef {
    switch (type) {
        case 'day':
            return { type, literal: '', placeholder: 'DD', ariaLabel: 'Day', size: 2 };
        case 'month':
            return { type, literal: '', placeholder: 'MM', ariaLabel: 'Month', size: 2 };
        default:
            return { type, literal: '', placeholder: 'YYYY', ariaLabel: 'Year', size: 4 };
    }
}

@customElement({
    name: 'au-date-input',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuDateInputCustomElement implements ICustomElementViewModel {
    @bindable({ mode: BindingMode.twoWay }) public value: string = '';
    @bindable public label: string = '';
    @bindable public helper: string = '';
    @bindable public error: string = '';
    @bindable public disabled: boolean = false;
    @bindable public required: boolean = false;
    @bindable public min: string = '';
    @bindable public max: string = '';
    @bindable public locale?: string = undefined;
    @bindable public showCalendar: boolean = true;
    @bindable public firstDayOfWeek: number = 1;

    public segmentLayout: SegmentDef[] = [];
    public internalError: string = '';
    public calendarOpen: boolean = false;
    public viewYear: number = new Date().getFullYear();
    public viewMonth: number = new Date().getMonth();

    private readonly segmentsState: Record<SegmentType, string> = { day: '', month: '', year: '' };
    private syncingFromSegments = false;
    private readonly hostElement = resolve(HTMLElement);
    private readonly generatedId = `au-date-input-${++dateInputId}`;
    private readonly boundDocumentClick = (event: MouseEvent) => this.handleDocumentClick(event);

    public get controlId() {
        return this.generatedId;
    }

    public get labelId() {
        return `${this.controlId}-label`;
    }

    public get helperId() {
        return this.helper ? `${this.controlId}-helper` : '';
    }

    public get errorId() {
        return this.error ? `${this.controlId}-error` : '';
    }

    public get internalErrorId() {
        return this.internalError ? `${this.controlId}-validation` : '';
    }

    public get describedBy() {
        const ids: string[] = [];
        if (this.errorId) {
            ids.push(this.errorId);
        }
        if (this.internalErrorId) {
            ids.push(this.internalErrorId);
        }
        if (this.helperId) {
            ids.push(this.helperId);
        }
        return ids.length ? ids.join(' ') : null;
    }

    public get calendarCaption() {
        return new Intl.DateTimeFormat(this.locale || undefined, { month: 'long', year: 'numeric' })
            .format(new Date(this.viewYear, this.viewMonth, 1));
    }

    public get weekdayNames(): string[] {
        const firstDay = this.normalizedFirstDay;
        const formatter = new Intl.DateTimeFormat(this.locale || undefined, { weekday: 'short' });
        const names: string[] = [];
        // 2021-08-01 is a Sunday; offset from it to honor firstDayOfWeek.
        for (let i = 0; i < 7; i++) {
            names.push(formatter.format(new Date(2021, 7, 1 + ((firstDay + i) % 7))));
        }
        return names;
    }

    public get calendarWeeks(): Array<Array<CalendarCell | null>> {
        const firstDay = this.normalizedFirstDay;
        const firstOfMonth = new Date(this.viewYear, this.viewMonth, 1);
        const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
        const lead = (firstOfMonth.getDay() - firstDay + 7) % 7;
        const now = new Date();
        const todayIso = toIso(now.getFullYear(), now.getMonth() + 1, now.getDate());
        const cells: Array<CalendarCell | null> = [];
        for (let i = 0; i < lead; i++) {
            cells.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const iso = toIso(this.viewYear, this.viewMonth + 1, day);
            cells.push({
                day,
                iso,
                disabled: this.isOutOfRange(iso),
                selected: iso === this.value,
                today: iso === todayIso
            });
        }
        while (cells.length % 7 !== 0) {
            cells.push(null);
        }
        const weeks: Array<Array<CalendarCell | null>> = [];
        for (let i = 0; i < cells.length; i += 7) {
            weeks.push(cells.slice(i, i + 7));
        }
        return weeks;
    }

    public binding() {
        this.buildSegmentLayout();
    }

    public bound() {
        this.applyValueToSegments(this.value ?? '');
    }

    public attached() {
        this.hostElement.ownerDocument.addEventListener('click', this.boundDocumentClick);
        this.syncSegmentInputs();
    }

    public detaching() {
        this.hostElement.ownerDocument.removeEventListener('click', this.boundDocumentClick);
    }

    public localeChanged() {
        this.buildSegmentLayout();
        // The segment inputs re-render; re-apply their values afterwards.
        Promise.resolve().then(() => this.syncSegmentInputs());
    }

    public valueChanged(newValue: string) {
        if (!this.syncingFromSegments) {
            this.applyValueToSegments(newValue ?? '');
        }
    }

    public handleFieldKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && this.calendarOpen) {
            event.stopPropagation();
            this.calendarOpen = false;
        }
    }

    public handleSegmentInput(event: Event, type: SegmentType) {
        if (this.disabled) {
            return;
        }
        const target = event.target as HTMLInputElement | null;
        if (!target) {
            return;
        }
        const size = type === 'year' ? 4 : 2;
        const digits = (target.value ?? '').replace(/\D/g, '').slice(0, size);
        if (target.value !== digits) {
            target.value = digits;
        }
        this.segmentsState[type] = digits;
        if (digits.length === size) {
            this.focusNextSegment(type);
        }
        this.commitFromSegments();
    }

    public handleSegmentKeydown(event: KeyboardEvent, type: SegmentType) {
        if (this.disabled) {
            return;
        }
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            this.stepSegment(type, event.key === 'ArrowUp' ? 1 : -1);
        } else if (event.key === 'Backspace') {
            event.preventDefault();
            this.segmentsState[type] = '';
            const input = this.segmentInput(type);
            if (input) {
                input.value = '';
            }
            this.commitFromSegments();
        }
    }

    public toggleCalendar() {
        if (this.disabled) {
            return;
        }
        if (this.calendarOpen) {
            this.calendarOpen = false;
            return;
        }
        const parsed = this.parseIso(this.value);
        if (parsed) {
            this.viewYear = parsed.year;
            this.viewMonth = parsed.month - 1;
        } else {
            const now = new Date();
            this.viewYear = now.getFullYear();
            this.viewMonth = now.getMonth();
        }
        this.calendarOpen = true;
    }

    public previousMonth() {
        if (this.viewMonth === 0) {
            this.viewMonth = 11;
            this.viewYear -= 1;
        } else {
            this.viewMonth -= 1;
        }
    }

    public nextMonth() {
        if (this.viewMonth === 11) {
            this.viewMonth = 0;
            this.viewYear += 1;
        } else {
            this.viewMonth += 1;
        }
    }

    public selectDay(cell: CalendarCell | null) {
        if (!cell || cell.disabled || this.disabled) {
            return;
        }
        const parsed = this.parseIso(cell.iso);
        if (!parsed) {
            return;
        }
        this.segmentsState.day = pad(parsed.day, 2);
        this.segmentsState.month = pad(parsed.month, 2);
        this.segmentsState.year = pad(parsed.year, 4);
        this.internalError = '';
        this.syncSegmentInputs();
        this.setValueInternal(cell.iso);
        this.calendarOpen = false;
    }

    private get normalizedFirstDay(): number {
        const raw = Number(this.firstDayOfWeek);
        return Number.isFinite(raw) ? ((Math.trunc(raw) % 7) + 7) % 7 : 1;
    }

    private buildSegmentLayout() {
        const layout: SegmentDef[] = [];
        try {
            const parts = new Intl.DateTimeFormat(this.locale || undefined).formatToParts(new Date(2000, 10, 22));
            for (const part of parts) {
                if (part.type === 'day' || part.type === 'month' || part.type === 'year') {
                    layout.push(segmentDef(part.type));
                } else if (part.type === 'literal' && layout.length) {
                    layout[layout.length - 1].literal = part.value;
                }
            }
        } catch {
            // fall through to the default layout below
        }
        const complete = SEGMENT_TYPES.every(type => layout.some(segment => segment.type === type));
        if (!complete) {
            this.segmentLayout = SEGMENT_TYPES.map(type => {
                const def = segmentDef(type);
                def.literal = type === 'year' ? '' : '/';
                return def;
            });
            return;
        }
        layout[layout.length - 1].literal = '';
        this.segmentLayout = layout;
    }

    private segmentInput(type: SegmentType): HTMLInputElement | null {
        return this.hostElement.shadowRoot?.querySelector(`.segment[data-type="${type}"]`) ?? null;
    }

    private syncSegmentInputs() {
        SEGMENT_TYPES.forEach(type => {
            const input = this.segmentInput(type);
            if (input && input.value !== this.segmentsState[type]) {
                input.value = this.segmentsState[type];
            }
        });
    }

    private focusNextSegment(type: SegmentType) {
        const order = this.segmentLayout.map(segment => segment.type);
        const next = order[order.indexOf(type) + 1];
        if (next) {
            this.segmentInput(next)?.focus();
        }
    }

    private stepSegment(type: SegmentType, delta: number) {
        const current = parseInt(this.segmentsState[type], 10);
        let next: number;
        if (type === 'year') {
            next = Number.isNaN(current) ? new Date().getFullYear() : Math.min(9999, Math.max(1, current + delta));
        } else {
            const max = type === 'month' ? 12 : 31;
            if (Number.isNaN(current)) {
                next = delta > 0 ? 1 : max;
            } else {
                next = current + delta;
                if (next > max) {
                    next = 1;
                }
                if (next < 1) {
                    next = max;
                }
            }
        }
        this.segmentsState[type] = pad(next, type === 'year' ? 4 : 2);
        this.syncSegmentInputs();
        this.commitFromSegments();
    }

    private commitFromSegments() {
        const { day, month, year } = this.segmentsState;
        if (!day && !month && !year) {
            this.internalError = '';
            if (this.value) {
                this.setValueInternal('');
            }
            return;
        }
        if (!day || !month || year.length < 4) {
            this.internalError = '';
            return;
        }
        const dayNumber = parseInt(day, 10);
        const monthNumber = parseInt(month, 10);
        const yearNumber = parseInt(year, 10);
        if (!isRealDate(yearNumber, monthNumber, dayNumber)) {
            this.internalError = 'Please enter a valid date.';
            return;
        }
        const iso = toIso(yearNumber, monthNumber, dayNumber);
        if (this.min && iso < this.min) {
            this.internalError = `Date must be on or after ${this.min}.`;
            return;
        }
        if (this.max && iso > this.max) {
            this.internalError = `Date must be on or before ${this.max}.`;
            return;
        }
        this.internalError = '';
        this.viewYear = yearNumber;
        this.viewMonth = monthNumber - 1;
        if (iso !== this.value) {
            this.setValueInternal(iso);
        }
    }

    private setValueInternal(iso: string) {
        this.syncingFromSegments = true;
        this.value = iso;
        this.syncingFromSegments = false;
        this.hostElement.dispatchEvent(new CustomEvent('change', {
            detail: { value: iso },
            bubbles: true,
            composed: true
        }));
    }

    private applyValueToSegments(value: string) {
        const parsed = this.parseIso(value);
        if (parsed) {
            this.segmentsState.day = pad(parsed.day, 2);
            this.segmentsState.month = pad(parsed.month, 2);
            this.segmentsState.year = pad(parsed.year, 4);
            this.viewYear = parsed.year;
            this.viewMonth = parsed.month - 1;
            this.internalError = '';
        } else if (!value) {
            this.segmentsState.day = '';
            this.segmentsState.month = '';
            this.segmentsState.year = '';
        }
        this.syncSegmentInputs();
    }

    private parseIso(value: string): { year: number; month: number; day: number } | null {
        const match = ISO_PATTERN.exec(value ?? '');
        if (!match) {
            return null;
        }
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const day = parseInt(match[3], 10);
        return isRealDate(year, month, day) ? { year, month, day } : null;
    }

    private isOutOfRange(iso: string): boolean {
        if (this.min && iso < this.min) {
            return true;
        }
        if (this.max && iso > this.max) {
            return true;
        }
        return false;
    }

    private handleDocumentClick(event: MouseEvent) {
        if (this.calendarOpen && !this.hostElement.contains(event.target as Node)) {
            this.calendarOpen = false;
        }
    }
}
