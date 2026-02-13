import React, { useMemo, useCallback } from 'react';
import { useListField } from '../hooks/useField';
import { useFormContext } from '../context/FormProvider';
import { FormField } from './FormField';
import type { FormCardListProps, CardItemProps, FieldSchema, CardSection } from '../types';

const cardStyles = {
  container: {
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    marginBottom: '12px',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#F9FAFB',
    borderBottom: '1px solid #E5E7EB'
  },
  headerTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151'
  },
  headerActions: {
    display: 'flex',
    gap: '8px'
  },
  actionButton: {
    padding: '4px 8px',
    fontSize: '12px',
    border: '1px solid #D1D5DB',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    color: '#6B7280'
  },
  actionButtonDanger: {
    padding: '4px 8px',
    fontSize: '12px',
    border: '1px solid #FCA5A5',
    borderRadius: '4px',
    backgroundColor: '#FEF2F2',
    cursor: 'pointer',
    color: '#DC2626'
  },
  body: {
    padding: '16px'
  },
  section: {
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#6B7280',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  },
  addButton: {
    width: '100%',
    padding: '12px',
    border: '2px dashed #D1D5DB',
    borderRadius: '8px',
    backgroundColor: '#F9FAFB',
    cursor: 'pointer',
    color: '#6B7280',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  }
};

function DefaultCardItem({ 
  index, 
  total, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  onCopy,
  data: _data,
  children 
}: CardItemProps & { children?: React.ReactNode }) {
  return React.createElement('div', { style: cardStyles.container },
    React.createElement('div', { style: cardStyles.header },
      React.createElement('span', { style: cardStyles.headerTitle }, 
        `项目 ${index + 1} / ${total}`
      ),
      React.createElement('div', { style: cardStyles.headerActions },
        onMoveUp && index > 0 && React.createElement('button', {
          style: cardStyles.actionButton,
          onClick: onMoveUp
        }, '↑ 上移'),
        onMoveDown && index < total - 1 && React.createElement('button', {
          style: cardStyles.actionButton,
          onClick: onMoveDown
        }, '↓ 下移'),
        onCopy && React.createElement('button', {
          style: cardStyles.actionButton,
          onClick: onCopy
        }, '📋 复制'),
        React.createElement('button', {
          style: cardStyles.actionButtonDanger,
          onClick: onRemove
        }, '🗑 删除')
      )
    ),
    React.createElement('div', { style: cardStyles.body }, children)
  );
}

export function FormCardList({ 
  fieldKey, 
  renderItem,
  itemClassName,
  containerClassName 
}: FormCardListProps) {
  const { schema } = useFormContext();
  const { items, addItem, removeItem, moveItem } = useListField(fieldKey);

  const listField = useMemo(() => {
    return schema.find((f: FieldSchema) => f.key === fieldKey);
  }, [schema, fieldKey]);

  const cardConfig = listField?.card;
  const sections = cardConfig?.sections || [];

  const handleAddItem = useCallback(() => {
    const defaultItem: Record<string, any> = {};
    sections.forEach((section: CardSection) => {
      section.fields.forEach((field: FieldSchema) => {
        if (field.type === 'NUMBER' || field.type === 'MONETARY') {
          defaultItem[field.key] = 0;
        } else if (field.type === 'BOOLEAN') {
          defaultItem[field.key] = false;
        } else if (field.type === 'CARD_LIST') {
          defaultItem[field.key] = [];
        } else {
          defaultItem[field.key] = '';
        }
      });
    });
    addItem(defaultItem);
  }, [addItem, sections]);

  const handleCopyItem = useCallback((index: number) => {
    const itemToCopy = items[index];
    if (itemToCopy) {
      addItem({ ...itemToCopy });
    }
  }, [addItem, items]);

  const handleMoveUp = useCallback((index: number) => {
    if (index > 0) {
      moveItem(index, index - 1);
    }
  }, [moveItem]);

  const handleMoveDown = useCallback((index: number) => {
    if (index < items.length - 1) {
      moveItem(index, index + 1);
    }
  }, [moveItem, items.length]);

  const renderCardContent = (rowIndex: number) => {
    return sections.map((section: CardSection, sectionIndex: number) => 
      React.createElement('div', { 
        key: sectionIndex, 
        style: cardStyles.section 
      },
        section.title && React.createElement('div', { 
          style: cardStyles.sectionTitle 
        }, section.title),
        React.createElement('div', { style: cardStyles.grid },
          section.fields.map((field: FieldSchema) => 
            React.createElement(FormField, {
              key: field.key,
              fieldKey: field.key,
              path: `${fieldKey}.${rowIndex}.${field.key}`
            })
          )
        )
      )
    );
  };

  const renderCard = (item: any, index: number) => {
    const cardItemProps: CardItemProps = {
      index,
      total: items.length,
      onRemove: () => removeItem(index),
      onMoveUp: index > 0 ? () => handleMoveUp(index) : undefined,
      onMoveDown: index < items.length - 1 ? () => handleMoveDown(index) : undefined,
      onCopy: () => handleCopyItem(index),
      data: item
    };

    if (renderItem) {
      return renderItem(cardItemProps);
    }

    return React.createElement(DefaultCardItem, {
      ...cardItemProps,
      key: index
    }, renderCardContent(index));
  };

  const allowAdd = listField?.behavior?.allow_add !== false;

  return React.createElement('div', { className: containerClassName },
    items.map((item: any, index: number) => 
      React.createElement('div', { 
        key: index, 
        className: itemClassName 
      }, renderCard(item, index))
    ),
    allowAdd && React.createElement('button', {
      style: cardStyles.addButton,
      onClick: handleAddItem
    }, '+ 添加项目')
  );
}

export { DefaultCardItem };
