/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Button, Input, Dropdown } from 'semantic-ui-react';
import selectors from '../../../selectors';
import entryActions from '../../../entry-actions';
import styles from './GlobalInboxDrawer.module.scss';

const GlobalInboxDrawer = React.memo(({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [newCardTitle, setNewCardTitle] = useState('');
  const [inboxCards, setInboxCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentBoard = useSelector(selectors.selectCurrentBoard);
  const boardLists = useSelector((state) => selectors.selectListsForCurrentBoard(state) || []);

  const fetchInboxCards = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inbox-cards', {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setInboxCards(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load inbox cards', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchInboxCards();
    }
  }, [isOpen, fetchInboxCards]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    try {
      const res = await fetch('/api/inbox-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCardTitle.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setInboxCards((prev) => [data.item, ...prev]);
        setNewCardTitle('');
      }
    } catch (err) {
      console.error('Failed to create inbox card', err);
    }
  };

  const handleMoveToCurrentList = async (cardId, listId) => {
    if (!currentBoard) return;
    try {
      await fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId: currentBoard.id,
          listId,
          isInbox: false,
        }),
      });
      setInboxCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (err) {
      console.error('Failed to move card to list', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <div className={styles.title}>
            <Icon name="inbox" /> Global Quick-Capture Inbox
          </div>
          <Button icon basic size="small" onClick={onClose}>
            <Icon name="close" />
          </Button>
        </div>

        <form onSubmit={handleCreate} className={styles.quickForm}>
          <Input
            fluid
            placeholder="Capture an idea or task..."
            value={newCardTitle}
            onChange={(e, { value }) => setNewCardTitle(value)}
            action={{ icon: 'plus', color: 'blue', content: 'Capture' }}
          />
        </form>

        <div className={styles.cardsList}>
          {loading && <div className={styles.empty}>Loading inbox...</div>}
          {!loading && inboxCards.length === 0 && (
            <div className={styles.empty}>
              <Icon name="check circle outline" size="large" />
              <p>Inbox zero! All caught up.</p>
            </div>
          )}
          {inboxCards.map((card) => (
            <div key={card.id} className={styles.cardItem}>
              <div className={styles.cardName}>{card.name}</div>
              {currentBoard && boardLists.length > 0 && (
                <Dropdown
                  text="Move to List"
                  icon="exchange"
                  button
                  basic
                  size="mini"
                  className={styles.moveDropdown}
                >
                  <Dropdown.Menu>
                    <Dropdown.Header content={`Move to ${currentBoard.name}`} />
                    {boardLists.map((list) => (
                      <Dropdown.Item
                        key={list.id}
                        text={list.name}
                        onClick={() => handleMoveToCurrentList(card.id, list.id)}
                      />
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default GlobalInboxDrawer;
