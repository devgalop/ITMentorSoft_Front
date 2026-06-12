import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let fixture: ComponentFixture<InputComponent>;
  let control: FormControl<string | null>;

  function createComponent(inputs: {
    id: string;
    type?: string;
    placeholder?: string;
    control: FormControl<string | null>;
    error?: string | null;
  }) {
    fixture = TestBed.createComponent(InputComponent);
    const componentRef = fixture.componentRef;
    componentRef.setInput('id', inputs.id);
    componentRef.setInput('type', inputs.type ?? 'text');
    componentRef.setInput('placeholder', inputs.placeholder ?? '');
    componentRef.setInput('control', inputs.control);
    if (inputs.error !== undefined) {
      componentRef.setInput('error', inputs.error);
    }
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  beforeEach(async () => {
    control = new FormControl('');
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, InputComponent],
    }).compileComponents();
  });

  it('renders input element', () => {
    const component = createComponent({ id: 'test-input', control });
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
  });

  it('renders with correct id', () => {
    createComponent({ id: 'test-input', control });
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.id).toBe('test-input');
  });

  it('renders with correct placeholder', () => {
    createComponent({ id: 'test-input', placeholder: 'Enter value', control });
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.placeholder).toBe('Enter value');
  });

  it('shows error when provided', () => {
    createComponent({ id: 'test-input', control, error: 'This field is required' });
    const errorEl = fixture.debugElement.query(By.css('.app-input__error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent.trim()).toBe('This field is required');
  });

  it('does not show error when not provided', () => {
    createComponent({ id: 'test-input', control });
    const errorEl = fixture.debugElement.query(By.css('.app-input__error'));
    expect(errorEl).toBeFalsy();
  });

  it('sets aria-invalid when error is present', () => {
    createComponent({ id: 'test-input', control, error: 'Invalid value' });
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('aria-invalid')).toBe('true');
  });
});
