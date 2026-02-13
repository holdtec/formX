import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useField } from '../hooks/useField';
import type { FormFieldProps, FieldRenderProps, FieldSchema } from '../types';

const defaultStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '12px'
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151'
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box'
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
    cursor: 'not-allowed'
  },
  inputReadOnly: {
    backgroundColor: '#F9FAFB',
    color: '#6B7280'
  },
  error: {
    color: '#EF4444',
    fontSize: '12px'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box'
  },
  textarea: {
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
    width: '100%',
    boxSizing: 'border-box'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  radioItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  checkboxItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  switch: {
    position: 'relative' as const,
    width: '44px',
    height: '24px',
    backgroundColor: '#D1D5DB',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  switchActive: {
    backgroundColor: '#6366F1'
  },
  switchThumb: {
    position: 'absolute' as const,
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  },
  switchThumbActive: {
    transform: 'translateX(20px)'
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#E5E7EB',
    outline: 'none',
    cursor: 'pointer'
  },
  dimensionSelector: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const
  },
  dimensionLevel: {
    flex: '1',
    minWidth: '120px'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 500,
    borderRadius: '4px',
    backgroundColor: '#EEF2FF',
    color: '#6366F1',
    marginLeft: '8px'
  }
};

function TextField({ value, onChange, disabled, readOnly, placeholder, field }: FieldRenderProps) {
  const style = {
    ...defaultStyles.input,
    ...(disabled ? defaultStyles.inputDisabled : {}),
    ...(readOnly ? defaultStyles.inputReadOnly : {})
  };

  return React.createElement('input', {
    type: 'text',
    value: value ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    disabled,
    readOnly,
    placeholder: placeholder || field?.ui?.placeholder,
    style
  });
}

function TextareaField({ value, onChange, disabled, readOnly, placeholder, field }: FieldRenderProps) {
  const style = {
    ...defaultStyles.textarea,
    ...(disabled ? defaultStyles.inputDisabled : {}),
    ...(readOnly ? defaultStyles.inputReadOnly : {})
  };

  const rows = (field as any)?.rows || 3;

  return React.createElement('textarea', {
    value: value ?? '',
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value),
    disabled,
    readOnly,
    placeholder: placeholder || field?.ui?.placeholder,
    rows,
    style
  });
}

function NumberField({ value, onChange, disabled, readOnly, placeholder, field }: FieldRenderProps) {
  const style = {
    ...defaultStyles.input,
    ...(disabled ? defaultStyles.inputDisabled : {}),
    ...(readOnly ? defaultStyles.inputReadOnly : {})
  };

  const min = (field as any)?.min;
  const max = (field as any)?.max;
  const step = (field as any)?.step || 1;

  return React.createElement('input', {
    type: 'number',
    value: value ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value === '' ? null : parseFloat(e.target.value);
      onChange(val);
    },
    disabled,
    readOnly,
    placeholder: placeholder || field?.ui?.placeholder,
    min,
    max,
    step,
    style
  });
}

function MonetaryField({ value, onChange, disabled, readOnly, placeholder, field }: FieldRenderProps) {
  const style = {
    ...defaultStyles.input,
    ...(disabled ? defaultStyles.inputDisabled : {}),
    ...(readOnly ? defaultStyles.inputReadOnly : {})
  };

  const displayValue = value != null ? Number(value).toFixed(2) : '';
  const prefix = (field as any)?.prefix || '¥';
  const suffix = (field as any)?.suffix;

  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
    React.createElement('span', { style: { color: '#6B7280', fontSize: '14px' } }, prefix),
    React.createElement('input', {
      type: 'number',
      value: displayValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value === '' ? null : parseFloat(e.target.value);
        onChange(val);
      },
      disabled,
      readOnly,
      placeholder: placeholder || field?.ui?.placeholder || '0.00',
      step: '0.01',
      style: { ...style, flex: 1 }
    }),
    suffix && React.createElement('span', { style: { color: '#6B7280', fontSize: '14px' } }, suffix)
  );
}

function BooleanField({ value, onChange, disabled, readOnly, field }: FieldRenderProps) {
  return React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: disabled ? 'not-allowed' : 'pointer' } },
    React.createElement('input', {
      type: 'checkbox',
      checked: Boolean(value),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked),
      disabled,
      readOnly,
      style: { width: '16px', height: '16px' }
    }),
    React.createElement('span', { style: { fontSize: '14px', color: disabled ? '#9CA3AF' : '#374151' } }, 
      field?.label || ''
    )
  );
}

function SwitchField({ value, onChange, disabled, readOnly }: FieldRenderProps) {
  const isActive = Boolean(value);
  
  return React.createElement('div', {
    onClick: () => !disabled && !readOnly && onChange(!isActive),
    style: {
      ...defaultStyles.switch,
      ...(isActive ? defaultStyles.switchActive : {}),
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  },
    React.createElement('div', {
      style: {
        ...defaultStyles.switchThumb,
        ...(isActive ? defaultStyles.switchThumbActive : {})
      }
    })
  );
}

function EnumField({ value, onChange, disabled, readOnly, field }: FieldRenderProps) {
  const style = {
    ...defaultStyles.select,
    ...(disabled ? defaultStyles.inputDisabled : {}),
    ...(readOnly ? defaultStyles.inputReadOnly : {})
  };

  const options = (field as any)?.options || [];

  return React.createElement('select', {
    value: value ?? '',
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value),
    disabled,
    style
  },
    React.createElement('option', { value: '' }, '-- 请选择 --'),
    options.map((opt: any) => 
      React.createElement('option', { key: opt.value, value: opt.value }, opt.label)
    )
  );
}

function RadioField({ value, onChange, disabled, readOnly: _readOnly, field }: FieldRenderProps) {
  const options = (field as any)?.options || [];
  const direction = (field as any)?.direction || 'vertical';

  return React.createElement('div', { 
    style: {
      ...defaultStyles.radioGroup,
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      gap: direction === 'horizontal' ? '16px' : '8px'
    }
  },
    options.map((opt: any) => 
      React.createElement('label', { 
        key: opt.value, 
        style: { ...defaultStyles.radioItem, opacity: disabled ? 0.5 : 1 }
      },
        React.createElement('input', {
          type: 'radio',
          name: field?.key,
          value: opt.value,
          checked: value === opt.value,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
          disabled,
          style: { width: '14px', height: '14px' }
        }),
        React.createElement('span', { style: { fontSize: '14px', color: '#374151' } }, opt.label)
      )
    )
  );
}

function CheckboxGroupField({ value, onChange, disabled, readOnly: _readOnly, field }: FieldRenderProps) {
  const options = (field as any)?.options || [];
  const selectedValues = Array.isArray(value) ? value : [];

  const handleChange = (optValue: any, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, optValue]);
    } else {
      onChange(selectedValues.filter((v: any) => v !== optValue));
    }
  };

  return React.createElement('div', { style: defaultStyles.checkboxGroup },
    options.map((opt: any) => 
      React.createElement('label', { 
        key: opt.value, 
        style: { ...defaultStyles.checkboxItem, opacity: disabled ? 0.5 : 1 }
      },
        React.createElement('input', {
          type: 'checkbox',
          checked: selectedValues.includes(opt.value),
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(opt.value, e.target.checked),
          disabled,
          style: { width: '14px', height: '14px' }
        }),
        React.createElement('span', { style: { fontSize: '14px', color: '#374151' } }, opt.label)
      )
    )
  );
}

function SliderField({ value, onChange, disabled, readOnly: _readOnly, field }: FieldRenderProps) {
  const min = (field as any)?.min || 0;
  const max = (field as any)?.max || 100;
  const step = (field as any)?.step || 1;
  const showValue = (field as any)?.showValue !== false;

  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
    React.createElement('input', {
      type: 'range',
      value: value ?? min,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value)),
      min,
      max,
      step,
      disabled,
      style: { ...defaultStyles.slider, flex: 1 }
    }),
    showValue && React.createElement('span', { 
      style: { 
        minWidth: '40px', 
        textAlign: 'right', 
        fontSize: '14px', 
        color: '#374151',
        fontWeight: 500
      } 
    }, value ?? min)
  );
}

function DateField({ value, onChange, disabled, readOnly, placeholder: _placeholder, field: _field }: FieldRenderProps) {
  const style = {
    ...defaultStyles.input,
    ...(disabled ? defaultStyles.inputDisabled : {}),
    ...(readOnly ? defaultStyles.inputReadOnly : {})
  };

  return React.createElement('input', {
    type: 'date',
    value: value || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    disabled,
    readOnly,
    style
  });
}

function DateTimeField({ value, onChange, disabled, readOnly, placeholder: _placeholder, field: _field }: FieldRenderProps) {
  const style = {
    ...defaultStyles.input,
    ...(disabled ? defaultStyles.inputDisabled : {}),
    ...(readOnly ? defaultStyles.inputReadOnly : {})
  };

  return React.createElement('input', {
    type: 'datetime-local',
    value: value || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    disabled,
    readOnly,
    style
  });
}

function DimensionField({ value, onChange, disabled, readOnly: _readOnly, field }: FieldRenderProps) {
  const levels = (field as any)?.levels || [];
  const [openLevel, setOpenLevel] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValues = Array.isArray(value) ? value : [];
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenLevel(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAllOptions = useMemo(() => {
    const result: Record<number, any[]> = {};
    levels.forEach((_: any, index: number) => {
      if (index === 0) {
        result[index] = levels[index]?.options || [];
      } else {
        const parentValue = selectedValues[index - 1];
        if (parentValue && result[index - 1]) {
          const parentOption = result[index - 1].find((opt: any) => opt.value === parentValue);
          result[index] = parentOption?.children || levels[index]?.options || [];
        } else {
          result[index] = [];
        }
      }
    });
    return result;
  }, [levels, selectedValues]);

  const handleLevelChange = (levelIndex: number, selectedValue: any) => {
    const newValues = [...selectedValues];
    newValues[levelIndex] = selectedValue;
    newValues.length = levelIndex + 1;
    onChange(newValues);
    setOpenLevel(null);
  };

  if (levels.length === 0) {
    return React.createElement('div', { style: { color: '#9CA3AF', fontSize: '14px' } }, 
      '未配置维度层级'
    );
  }

  return React.createElement('div', { 
    ref: containerRef,
    style: defaultStyles.dimensionSelector 
  },
    levels.map((level: any, levelIndex: number) => {
      const options = getAllOptions[levelIndex] || [];
      const selectedValue = selectedValues[levelIndex];
      const selectedOption = options.find((opt: any) => opt.value === selectedValue);

      return React.createElement('div', { 
        key: levelIndex, 
        style: { ...defaultStyles.dimensionLevel, position: 'relative' }
      },
        React.createElement('div', {
          onClick: () => !disabled && setOpenLevel(openLevel === levelIndex ? null : levelIndex),
          style: {
            ...defaultStyles.select,
            backgroundColor: disabled ? '#F3F4F6' : 'white',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1
          }
        },
          selectedOption?.label || level.placeholder || `请选择${level.label || `第${levelIndex + 1}级`}`
        ),
        openLevel === levelIndex && !disabled && React.createElement('div', {
          style: {
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            zIndex: 50,
            maxHeight: '200px',
            overflowY: 'auto'
          }
        },
          options.map((opt: any) => 
            React.createElement('div', {
              key: opt.value,
              onClick: () => handleLevelChange(levelIndex, opt.value),
              style: {
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: selectedValue === opt.value ? '#EEF2FF' : 'white',
                color: selectedValue === opt.value ? '#6366F1' : '#374151',
                fontSize: '14px'
              },
              onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.backgroundColor = '#F9FAFB',
              onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.backgroundColor = selectedValue === opt.value ? '#EEF2FF' : 'white'
            }, opt.label)
          )
        )
      );
    })
  );
}

function RatingField({ value, onChange, disabled, readOnly, field }: FieldRenderProps) {
  const max = (field as any)?.max || 5;
  const allowHalf = (field as any)?.allowHalf || false;
  const rating = value || 0;

  const handleClick = (index: number, isHalf: boolean = false) => {
    if (disabled || readOnly) return;
    const newValue = isHalf ? index + 0.5 : index + 1;
    onChange(newValue);
  };

  return React.createElement('div', { style: { display: 'flex', gap: '4px' } },
    Array.from({ length: max }).map((_, index) => {
      const isFilled = rating >= index + 1;
      const isHalfFilled = allowHalf && rating === index + 0.5;

      return React.createElement('span', {
        key: index,
        onClick: (e: React.MouseEvent<HTMLSpanElement>) => {
          if (allowHalf) {
            const rect = e.currentTarget.getBoundingClientRect();
            const isHalf = e.clientX - rect.left < rect.width / 2;
            handleClick(index, isHalf);
          } else {
            handleClick(index);
          }
        },
        style: {
          fontSize: '24px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: isFilled || isHalfFilled ? '#FBBF24' : '#E5E7EB',
          opacity: disabled ? 0.5 : 1
        }
      }, isHalfFilled ? '★' : '★');
    })
  );
}

function ColorField({ value, onChange, disabled, readOnly: _readOnly, field: _field }: FieldRenderProps) {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
    React.createElement('input', {
      type: 'color',
      value: value || '#000000',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
      disabled,
      style: {
        width: '40px',
        height: '40px',
        padding: 0,
        border: '1px solid #D1D5DB',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }
    }),
    React.createElement('input', {
      type: 'text',
      value: value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
      disabled,
      placeholder: '#000000',
      style: {
        ...defaultStyles.input,
        width: '100px',
        ...(disabled ? defaultStyles.inputDisabled : {})
      }
    })
  );
}

function FileField({ value, onChange, disabled, readOnly: _readOnly, field }: FieldRenderProps) {
  const accept = (field as any)?.accept || '*';
  const multiple = (field as any)?.multiple || false;
  const files = Array.isArray(value) ? value : value ? [value] : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (multiple) {
      onChange(selectedFiles);
    } else {
      onChange(selectedFiles[0] || null);
    }
  };

  return React.createElement('div', { style: {} },
    React.createElement('input', {
      type: 'file',
      accept,
      multiple,
      onChange: handleChange,
      disabled,
      style: {
        fontSize: '14px',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }
    }),
    files.length > 0 && React.createElement('div', { 
      style: { marginTop: '8px', fontSize: '12px', color: '#6B7280' }
    },
      `已选择 ${files.length} 个文件`
    )
  );
}

function ReadOnlyField({ value, field }: FieldRenderProps) {
  const format = (field as any)?.format;
  let displayValue = value;

  if (format === 'currency' && typeof value === 'number') {
    displayValue = `¥${value.toFixed(2)}`;
  } else if (format === 'percent' && typeof value === 'number') {
    displayValue = `${(value * 100).toFixed(2)}%`;
  } else if (value === null || value === undefined) {
    displayValue = '-';
  }

  return React.createElement('div', { 
    style: {
      padding: '8px 0',
      fontSize: '14px',
      color: '#374151',
      fontWeight: 500
    }
  }, String(displayValue));
}

const fieldComponents: Record<string, React.FC<FieldRenderProps>> = {
  TEXT: TextField,
  TEXTAREA: TextareaField,
  NUMBER: NumberField,
  MONETARY: MonetaryField,
  BOOLEAN: BooleanField,
  SWITCH: SwitchField,
  ENUM: EnumField,
  SELECT: EnumField,
  RADIO: RadioField,
  CHECKBOX: CheckboxGroupField,
  SLIDER: SliderField,
  DATE: DateField,
  DATETIME: DateTimeField,
  DIMENSION: DimensionField,
  RATING: RatingField,
  COLOR: ColorField,
  FILE: FileField,
  HIDDEN: () => null,
  READONLY: ReadOnlyField
};

export function FormField({ 
  fieldKey, 
  label, 
  placeholder, 
  disabled, 
  className, 
  style,
  render,
  component: CustomComponent,
  path
}: FormFieldProps) {
  const { value, onChange, onBlur, disabled: fieldDisabled, readOnly, field } = useField(fieldKey, { path });

  const fieldType = field?.type || 'TEXT';
  const FieldComponent = CustomComponent || fieldComponents[fieldType] || TextField;

  const fieldProps: FieldRenderProps = useMemo(() => ({
    value,
    onChange,
    onBlur,
    disabled: disabled || fieldDisabled,
    readOnly,
    placeholder: placeholder || field?.ui?.placeholder,
    field: field as FieldSchema
  }), [value, onChange, onBlur, disabled, fieldDisabled, readOnly, placeholder, field]);

  if (render) {
    return React.createElement(React.Fragment, null, render(fieldProps));
  }

  if (fieldType === 'HIDDEN') {
    return null;
  }

  if (fieldType === 'BOOLEAN' || fieldType === 'SWITCH') {
    return React.createElement('div', { 
      style: { ...defaultStyles.container, ...style }, 
      className 
    },
      React.createElement('label', { 
        style: { 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: (disabled || fieldDisabled) ? 'not-allowed' : 'pointer'
        } 
      },
        React.createElement(FieldComponent, fieldProps),
        React.createElement('span', { style: defaultStyles.label },
          label || field?.label || fieldKey
        )
      )
    );
  }

  return React.createElement('div', { 
    style: { ...defaultStyles.container, ...style }, 
    className 
  },
    React.createElement('label', { style: { display: 'flex', alignItems: 'center' } },
      React.createElement('span', { style: defaultStyles.label },
        label || field?.label || fieldKey
      ),
      field?.read_only && React.createElement('span', { style: defaultStyles.badge }, '只读'),
      field?.expression && React.createElement('span', { style: { ...defaultStyles.badge, backgroundColor: '#FEF3C7', color: '#D97706' } }, '计算')
    ),
    React.createElement(FieldComponent, fieldProps),
    fieldProps.error && React.createElement('span', { style: defaultStyles.error }, fieldProps.error),
    field?.ui?.description && React.createElement('span', { 
      style: { fontSize: '12px', color: '#6B7280', marginTop: '4px' } 
    }, field.ui.description)
  );
}

export function createFieldComponent(type: string, component: React.FC<FieldRenderProps>) {
  fieldComponents[type] = component;
}

export { fieldComponents };
