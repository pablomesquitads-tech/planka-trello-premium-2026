/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Icon, Input, Form, Checkbox, Tab } from 'semantic-ui-react';
import selectors from '../../../../selectors';
import styles from './AutomationsModal.module.scss';

const AutomationsModal = React.memo(({ isOpen, onClose }) => {
  const currentBoard = useSelector(selectors.selectCurrentBoard);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nlPrompt, setNlPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [triggerType, setTriggerType] = useState('card_moved');

  const fetchRules = useCallback(async () => {
    if (!currentBoard) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/boards/${currentBoard.id}/automation-rules`);
      if (res.ok) {
        const data = await res.json();
        setRules(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load rules', err);
    } finally {
      setLoading(false);
    }
  }, [currentBoard]);

  useEffect(() => {
    if (isOpen) {
      fetchRules();
    }
  }, [isOpen, fetchRules]);

  const handleToggleRule = async (rule) => {
    try {
      const res = await fetch(`/api/automation-rules/${rule.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !rule.isActive }),
      });
      if (res.ok) {
        setRules((prev) =>
          prev.map((r) => (r.id === rule.id ? { ...r, isActive: !r.isActive } : r)),
        );
      }
    } catch (err) {
      console.error('Failed to toggle rule', err);
    }
  };

  const handleDeleteRule = async (id) => {
    try {
      const res = await fetch(`/api/automation-rules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRules((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete rule', err);
    }
  };

  const handleAiBuild = async () => {
    if (!nlPrompt.trim() || !currentBoard) return;
    try {
      setIsGenerating(true);
      const buildRes = await fetch(`/api/boards/${currentBoard.id}/automation-rules/ai-build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: nlPrompt }),
      });

      if (buildRes.ok) {
        const { item: generated } = await buildRes.json();
        // Save rule
        const saveRes = await fetch(`/api/boards/${currentBoard.id}/automation-rules`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: generated.name || nlPrompt.slice(0, 30),
            triggerType: generated.triggerType || 'card_moved',
            triggerConfig: generated.triggerConfig || {},
            conditionsConfig: generated.conditionsConfig || [],
            actionsConfig: generated.actionsConfig || [],
            type: generated.type || 'rule',
          }),
        });

        if (saveRes.ok) {
          const { item: createdRule } = await saveRes.json();
          setRules((prev) => [createdRule, ...prev]);
          setNlPrompt('');
        }
      }
    } catch (err) {
      console.error('Failed to build rule with AI', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const panes = [
    {
      menuItem: 'Rules & Triggers',
      render: () => (
        <Tab.Pane>
          <div className={styles.rulesList}>
            {loading && <div>Loading automation rules...</div>}
            {!loading && rules.length === 0 && (
              <div className={styles.empty}>
                <Icon name="bolt" size="large" />
                <p>No automation rules configured yet. Create one with AI below!</p>
              </div>
            )}
            {rules.map((rule) => (
              <div key={rule.id} className={styles.ruleCard}>
                <div className={styles.ruleInfo}>
                  <div className={styles.ruleName}>
                    <Icon name={rule.type === 'card_button' ? 'hand pointer' : 'bolt'} />
                    <strong>{rule.name}</strong>
                  </div>
                  <div className={styles.ruleMeta}>Trigger: {rule.triggerType}</div>
                </div>
                <div className={styles.ruleControls}>
                  <Checkbox
                    toggle
                    checked={rule.isActive}
                    onChange={() => handleToggleRule(rule)}
                  />
                  <Button
                    icon="trash"
                    basic
                    color="red"
                    size="tiny"
                    onClick={() => handleDeleteRule(rule.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: '✨ AI Natural Language Builder',
      render: () => (
        <Tab.Pane>
          <div className={styles.aiBuilder}>
            <p className={styles.aiDesc}>
              Describe your desired automation in plain English or Portuguese, and Butler AI will
              automatically configure the triggers, conditions, and actions.
            </p>
            <Form>
              <Form.TextArea
                placeholder='e.g. "When a card with Urgent label is moved to In Progress, set due date to 24 hours from now and add comment"'
                value={nlPrompt}
                onChange={(e, { value }) => setNlPrompt(value)}
                rows={3}
              />
              <Button
                primary
                icon
                labelPosition="left"
                onClick={handleAiBuild}
                loading={isGenerating}
                disabled={!nlPrompt.trim() || isGenerating}
              >
                <Icon name="magic" />
                Generate & Activate Rule
              </Button>
            </Form>
          </div>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Modal open={isOpen} onClose={onClose} size="small" closeIcon>
      <Modal.Header>
        <Icon name="lightning" color="yellow" /> Butler Automations (2026 Engine)
      </Modal.Header>
      <Modal.Content>
        <Tab panes={panes} />
      </Modal.Content>
    </Modal>
  );
});

export default AutomationsModal;
