import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';

export const TagBadge = ({ 
  tag, 
  onPress, 
  selected = false,
  size = 'medium', // small, medium
  showDelete = false,
  onDelete,
}) => {
  const colorIndex = tag.colorIndex || 0;
  const backgroundColor = Colors.tagColors[colorIndex % Colors.tagColors.length];
  const textColor = Colors.tagTextColors[colorIndex % Colors.tagTextColors.length];

  return (
    <TouchableOpacity
      style={[
        styles.badge,
        size === 'small' && styles.badgeSmall,
        { backgroundColor },
        selected && styles.selected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text 
        style={[
          styles.text, 
          size === 'small' && styles.textSmall,
          { color: textColor }
        ]}
      >
        {tag.name}
      </Text>
      {showDelete && (
        <TouchableOpacity 
          onPress={onDelete} 
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.deleteText, { color: textColor }]}>×</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

// 태그 선택 리스트
export const TagSelector = ({ 
  tags, 
  selectedTagId, 
  onSelectTag,
  style,
}) => {
  return (
    <View style={[styles.selectorContainer, style]}>
      {tags.map(tag => (
        <TagBadge
          key={tag.id}
          tag={tag}
          selected={selectedTagId === tag.id}
          onPress={() => onSelectTag(tag.id === selectedTagId ? null : tag.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  badgeSmall: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  selected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: FontSize.xs,
  },
  deleteButton: {
    marginLeft: Spacing.xs,
  },
  deleteText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
