/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Button } from 'semantic-ui-react';
import { push } from '../../../lib/redux-router';
import selectors from '../../../selectors';
import Paths from '../../../constants/Paths';
import styles from './CalendarView.module.scss';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarView = React.memo(() => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week'

  const currentBoard = useSelector(selectors.selectCurrentBoard);
  const cards = useSelector((state) => selectors.selectCardsForCurrentBoard(state) || []);
  const lists = useSelector((state) => selectors.selectListsForCurrentBoard(state) || []);

  const listById = useMemo(() => {
    return lists.reduce((acc, l) => {
      acc[l.id] = l;
      return acc;
    }, {});
  }, [lists]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = useCallback(() => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }, []);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleCardClick = useCallback(
    (cardId) => {
      dispatch(push(Paths.CARDS.replace(':id', cardId)));
    },
    [dispatch],
  );

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayIndex = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    // Leading days from previous month
    const prevLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Trailing days
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  // Group cards by day (YYYY-MM-DD)
  const cardsByDay = useMemo(() => {
    const map = {};
    cards.forEach((card) => {
      const dateStr = card.dueDate || card.scheduledStartTime;
      if (dateStr) {
        const key = new Date(dateStr).toISOString().split('T')[0];
        if (!map[key]) map[key] = [];
        map[key].push(card);
      }
    });
    return map;
  }, [cards]);

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.nav}>
          <Button icon basic size="small" onClick={handlePrev}>
            <Icon name="chevron left" />
          </Button>
          <Button basic size="small" onClick={handleToday}>
            Today
          </Button>
          <Button icon basic size="small" onClick={handleNext}>
            <Icon name="chevron right" />
          </Button>
          <h2 className={styles.monthTitle}>{monthName}</h2>
        </div>
        <div className={styles.modes}>
          <Button.Group size="small">
            <Button active={viewMode === 'month'} onClick={() => setViewMode('month')}>
              Month
            </Button>
            <Button active={viewMode === 'week'} onClick={() => setViewMode('week')}>
              Week
            </Button>
          </Button.Group>
        </div>
      </div>

      <div className={styles.gridHeader}>
        {DAYS.map((day) => (
          <div key={day} className={styles.gridHeaderCell}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {calendarDays.map((dayObj, idx) => {
          const key = dayObj.date.toISOString().split('T')[0];
          const isToday = new Date().toISOString().split('T')[0] === key;
          const dayCards = cardsByDay[key] || [];

          return (
            <div
              key={idx}
              className={`${styles.cell} ${!dayObj.isCurrentMonth ? styles.otherMonth : ''} ${
                isToday ? styles.today : ''
              }`}
            >
              <div className={styles.cellHeader}>
                <span className={styles.dayNumber}>{dayObj.date.getDate()}</span>
                {dayCards.length > 0 && <span className={styles.cardCountBadge}>{dayCards.length}</span>}
              </div>
              <div className={styles.cellCards}>
                {dayCards.map((card) => {
                  const list = listById[card.listId];
                  return (
                    <div
                      key={card.id}
                      className={styles.cardItem}
                      onClick={() => handleCardClick(card.id)}
                      title={card.name}
                    >
                      {list && (
                        <span
                          className={styles.listPill}
                          style={{ backgroundColor: list.color || '#4b5563' }}
                        />
                      )}
                      <span className={styles.cardName}>{card.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default CalendarView;
