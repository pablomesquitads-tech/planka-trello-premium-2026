/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Button, Dropdown } from 'semantic-ui-react';
import selectors from '../../../../selectors';
import entryActions from '../../../../entry-actions';
import styles from './TimelineView.module.scss';

const DAY_WIDTH = 48; // px per day

const TimelineView = React.memo(() => {
  const dispatch = useDispatch();
  const [groupBy, setGroupBy] = useState('list'); // 'list' | 'member'
  const [zoomDays, setZoomDays] = useState(30);

  const lists = useSelector((state) => selectors.selectListsForCurrentBoard(state) || []);
  const cards = useSelector((state) => selectors.selectCardsForCurrentBoard(state) || []);
  const users = useSelector((state) => selectors.selectUsersForCurrentBoard(state) || []);

  const startDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 5);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const days = useMemo(() => {
    const list = [];
    for (let i = 0; i < zoomDays; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      list.push(d);
    }
    return list;
  }, [startDate, zoomDays]);

  const handleCardClick = useCallback(
    (cardId) => {
      dispatch(entryActions.openCard(cardId));
    },
    [dispatch],
  );

  // Groups
  const groups = useMemo(() => {
    if (groupBy === 'member') {
      return users.map((u) => ({
        id: u.id,
        name: u.name || u.username,
        cards: cards.filter((c) => (c.userIds || []).includes(u.id) || c.creatorUserId === u.id),
      }));
    }
    return lists.map((l) => ({
      id: l.id,
      name: l.name,
      color: l.color,
      cards: cards.filter((c) => c.listId === l.id),
    }));
  }, [groupBy, lists, cards, users]);

  const getCardStyle = (card) => {
    const start = card.scheduledStartTime ? new Date(card.scheduledStartTime) : new Date(card.createdAt);
    const end = card.dueDate ? new Date(card.dueDate) : new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000);

    const diffStartDays = Math.max(0, (start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const durationDays = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const left = diffStartDays * DAY_WIDTH;
    const width = durationDays * DAY_WIDTH;

    return {
      left: `${left}px`,
      width: `${Math.min(width, zoomDays * DAY_WIDTH - left)}px`,
    };
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.groupSelector}>
          <span className={styles.label}>Group by:</span>
          <Button.Group size="small">
            <Button active={groupBy === 'list'} onClick={() => setGroupBy('list')}>
              List
            </Button>
            <Button active={groupBy === 'member'} onClick={() => setGroupBy('member')}>
              Member
            </Button>
          </Button.Group>
        </div>
        <div className={styles.zoomSelector}>
          <Button.Group size="small">
            <Button active={zoomDays === 14} onClick={() => setZoomDays(14)}>
              2 Weeks
            </Button>
            <Button active={zoomDays === 30} onClick={() => setZoomDays(30)}>
              1 Month
            </Button>
            <Button active={zoomDays === 60} onClick={() => setZoomDays(60)}>
              2 Months
            </Button>
          </Button.Group>
        </div>
      </div>

      <div className={styles.ganttContainer}>
        {/* Left Sidebar: Groups */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>Groups / Items</div>
          {groups.map((group) => (
            <div key={group.id} className={styles.groupSection}>
              <div className={styles.groupTitle} style={{ borderLeftColor: group.color || '#0052cc' }}>
                {group.name} ({group.cards.length})
              </div>
              {group.cards.map((card) => (
                <div key={card.id} className={styles.cardRowTitle} onClick={() => handleCardClick(card.id)}>
                  {card.name}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right Scrollable Timeline */}
        <div className={styles.timelineArea}>
          {/* Days Header */}
          <div className={styles.timeHeader}>
            {days.map((day, idx) => {
              const isToday = new Date().toDateString() === day.toDateString();
              return (
                <div key={idx} className={`${styles.timeHeaderCell} ${isToday ? styles.today : ''}`}>
                  <div className={styles.dayOfWeek}>{day.toLocaleString('default', { weekday: 'narrow' })}</div>
                  <div className={styles.dayNum}>{day.getDate()}</div>
                </div>
              );
            })}
          </div>

          {/* Grid Rows */}
          <div className={styles.gridBody}>
            {groups.map((group) => (
              <div key={group.id} className={styles.groupBody}>
                <div className={styles.groupBodySpacer} />
                {group.cards.map((card) => (
                  <div key={card.id} className={styles.timelineRow}>
                    <div
                      className={styles.ganttBar}
                      style={getCardStyle(card)}
                      onClick={() => handleCardClick(card.id)}
                      title={`${card.name} (${card.dueDate ? new Date(card.dueDate).toLocaleDateString() : 'No date'})`}
                    >
                      <span className={styles.barText}>{card.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default TimelineView;
