import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Input, Button, Modal, PremiumModal } from '../components/common';

export const TagsScreen = ({ navigation }) => {
  const { tags, addTag, updateTag, deleteTag, canAddTag, isPremium, limits } = useApp();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagName, setTagName] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleAddTag = async () => {
    if (!tagName.trim()) {
      Alert.alert('알림', '태그 이름을 입력해주세요.');
      return;
    }

    const result = await addTag({
      name: tagName.trim(),
      colorIndex: selectedColorIndex,
    });

    if (result.success) {
      setShowAddModal(false);
      setTagName('');
      setSelectedColorIndex(0);
    } else if (result.error === 'TAG_LIMIT') {
      setShowAddModal(false);
      setShowPremiumModal(true);
    }
  };

  const handleEditTag = async () => {
    if (!tagName.trim() || !editingTag) return;

    await updateTag(editingTag.id, {
      name: tagName.trim(),
      colorIndex: selectedColorIndex,
    });

    setShowEditModal(false);
    setEditingTag(null);
    setTagName('');
    setSelectedColorIndex(0);
  };

  const handleDeleteTag = (tag) => {
    Alert.alert(
      '태그 삭제',
      `"${tag.name}" 태그를 삭제하시겠습니까?\n이 태그가 지정된 할 일에서 태그가 제거됩니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteTag(tag.id),
        },
      ]
    );
  };

  const openEditModal = (tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setSelectedColorIndex(tag.colorIndex || 0);
    setShowEditModal(true);
  };

  const openAddModal = () => {
    if (!canAddTag()) {
      setShowPremiumModal(true);
      return;
    }
    setTagName('');
    setSelectedColorIndex(0);
    setShowAddModal(true);
  };

  const renderTagItem = ({ item }) => {
    const bgColor = Colors.tagColors[item.colorIndex % Colors.tagColors.length];
    const textColor = Colors.tagTextColors[item.colorIndex % Colors.tagTextColors.length];

    return (
      <TouchableOpacity
        style={[styles.tagItem, { backgroundColor: bgColor }]}
        onPress={() => openEditModal(item)}
        onLongPress={() => handleDeleteTag(item)}
      >
        <Text style={[styles.tagName, { color: textColor }]}>{item.name}</Text>
        <View style={styles.tagActions}>
          <TouchableOpacity
            style={styles.tagAction}
            onPress={() => openEditModal(item)}
          >
            <Text style={[styles.tagActionText, { color: textColor }]}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tagAction}
            onPress={() => handleDeleteTag(item)}
          >
            <Text style={[styles.tagActionText, { color: textColor }]}>삭제</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderColorPicker = () => (
    <View style={styles.colorPicker}>
      <Text style={styles.colorLabel}>색상 선택</Text>
      <View style={styles.colorGrid}>
        {Colors.tagColors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorItem,
              { backgroundColor: color },
              selectedColorIndex === index && styles.colorItemSelected,
            ]}
            onPress={() => setSelectedColorIndex(index)}
          >
            {selectedColorIndex === index && (
              <Text style={[styles.colorCheck, { color: Colors.tagTextColors[index] }]}>
                ✓
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🏷️</Text>
      <Text style={styles.emptyTitle}>태그가 없어요</Text>
      <Text style={styles.emptySubtitle}>
        태그를 만들어 할 일을 분류해보세요
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>태그 관리</Text>
        <View style={styles.headerRight}>
          {!isPremium && (
            <Text style={styles.limitText}>{tags.length}/{limits.maxTags}</Text>
          )}
        </View>
      </View>

      {/* 태그 목록 */}
      {tags.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={tags}
          renderItem={renderTagItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* 추가 버튼 */}
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Text style={styles.addButtonText}>+ 새 태그 추가</Text>
      </TouchableOpacity>

      {/* 추가 모달 */}
      <Modal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="새 태그"
      >
        <Input
          label="태그 이름"
          value={tagName}
          onChangeText={setTagName}
          placeholder="태그 이름을 입력하세요"
          autoFocus
        />
        {renderColorPicker()}
        <Button
          title="추가"
          onPress={handleAddTag}
          style={styles.modalButton}
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTag(null);
        }}
        title="태그 수정"
      >
        <Input
          label="태그 이름"
          value={tagName}
          onChangeText={setTagName}
          placeholder="태그 이름을 입력하세요"
        />
        {renderColorPicker()}
        <Button
          title="저장"
          onPress={handleEditTag}
          style={styles.modalButton}
        />
      </Modal>

      {/* 프리미엄 모달 */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        feature="TAG_LIMIT"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backText: {
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerRight: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  limitText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  tagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  tagName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  tagActions: {
    flexDirection: 'row',
  },
  tagAction: {
    marginLeft: Spacing.md,
    padding: Spacing.xs,
  },
  tagActionText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  colorPicker: {
    marginBottom: Spacing.lg,
  },
  colorLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorItemSelected: {
    borderWidth: 3,
    borderColor: Colors.textPrimary,
  },
  colorCheck: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  modalButton: {
    marginTop: Spacing.md,
  },
});
