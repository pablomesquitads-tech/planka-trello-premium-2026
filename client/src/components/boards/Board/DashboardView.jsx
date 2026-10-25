/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card as UICard, Icon } from 'semantic-ui-react';
import selectors from '../../../selectors';
import styles from './DashboardView.module.scss';

const DashboardView = React.memo(() => {
  const lists = useSelector((state) => selectors.selectListsForCurrentBoard(state) || []);
  const cards = useSelector((state) => selectors.selectCardsForCurrentBoard(state) || []);
  const users = useSelector((state) => selectors.selectUsersForCurrentBoard(state) || []);

  const totalCards = cards.length;
  const completedCards = cards.filter((c) => c.isDueCompleted || c.isClosed).length;
  const overdueCards = cards.filter(
    (c) => c.dueDate && new Date(c.dueDate) < new Date() && !c.isDueCompleted,
  ).length;
  const inProgressCards = totalCards - completedCards;
  const completionRate = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;

  // Distribution by List
  const listStats = useMemo(() => {
    return lists.map((l) => {
      const count = cards.filter((c) => c.listId === l.id).length;
      return {
        id: l.id,
        name: l.name,
        color: l.color || '#0052cc',
        wipLimit: l.wipLimit,
        count,
        percent: totalCards > 0 ? (count / totalCards) * 100 : 0,
      };
    });
  }, [lists, cards, totalCards]);

  // Member Workload
  const memberStats = useMemo(() => {
    return users.map((u) => {
      const assigned = cards.filter(
        (c) => (c.userIds || []).includes(u.id) || c.creatorUserId === u.id,
      ).length;
      return {
        id: u.id,
        name: u.name || u.username,
        count: assigned,
      };
    });
  }, [users, cards]);

  return (
    <div className={styles.wrapper}>
      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Total Cards</div>
          <div className={styles.kpiValue}>{totalCards}</div>
          <div className={styles.kpiSub}>Board Workload</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiSuccess}`}>
          <div className={styles.kpiLabel}>Completed</div>
          <div className={styles.kpiValue}>{completedCards}</div>
          <div className={styles.kpiSub}>{completionRate}% finished</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiWarning}`}>
          <div className={styles.kpiLabel}>In Progress</div>
          <div className={styles.kpiValue}>{inProgressCards}</div>
          <div className={styles.kpiSub}>Active Flow</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiDanger}`}>
          <div className={styles.kpiLabel}>Overdue</div>
          <div className={styles.kpiValue}>{overdueCards}</div>
          <div className={styles.kpiSub}>Needs Attention</div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* List Distribution & WIP Bottlenecks */}
        <div className={styles.chartPanel}>
          <h3 className={styles.chartTitle}>
            <Icon name="columns" /> Cards by List & WIP Capacity
          </h3>
          <div className={styles.listBars}>
            {listStats.map((item) => {
              const isOverWip = item.wipLimit && item.count > item.wipLimit;
              return (
                <div key={item.id} className={styles.barItem}>
                  <div className={styles.barLabelGroup}>
                    <span className={styles.barLabel}>{item.name}</span>
                    <span className={`${styles.barCount} ${isOverWip ? styles.overWipText : ''}`}>
                      {item.count} {item.wipLimit ? `/ ${item.wipLimit} max` : 'cards'}
                    </span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${isOverWip ? styles.barOverWip : ''}`}
                      style={{
                        width: `${Math.min(100, item.percent)}%`,
                        backgroundColor: isOverWip ? '#de350b' : item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member Allocation */}
        <div className={styles.chartPanel}>
          <h3 className={styles.chartTitle}>
            <Icon name="users" /> Team Workload Distribution
          </h3>
          <div className={styles.memberList}>
            {memberStats.map((member) => (
              <div key={member.id} className={styles.memberRow}>
                <div className={styles.memberName}>
                  <Icon name="user circle" /> {member.name}
                </div>
                <div className={styles.memberBadge}>{member.count} assigned</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default DashboardView;
