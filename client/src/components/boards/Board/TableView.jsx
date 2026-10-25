/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Icon, Input, Dropdown } from 'semantic-ui-react';
import selectors from '../../../../selectors';
import entryActions from '../../../../entry-actions';
import styles from './TableView.module.scss';

const TableView = React.memo(() => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  const lists = useSelector((state) => selectors.selectListsForCurrentBoard(state) || []);
  const cards = useSelector((state) => selectors.selectCardsForCurrentBoard(state) || []);
  const users = useSelector((state) => selectors.selectUsersForCurrentBoard(state) || []);

  const listMap = useMemo(() => {
    return lists.reduce((acc, l) => ({ ...acc, [l.id]: l.name }), {});
  }, [lists]);

  const userMap = useMemo(() => {
    return users.reduce((acc, u) => ({ ...acc, [u.id]: u.name || u.username }), {});
  }, [users]);

  const handleCardClick = useCallback(
    (cardId) => {
      dispatch(entryActions.openCard(cardId));
    },
    [dispatch],
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredAndSortedCards = useMemo(() => {
    let result = cards.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    result.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (sortField === 'list') {
        valA = listMap[a.listId] || '';
        valB = listMap[b.listId] || '';
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [cards, searchTerm, sortField, sortAsc, listMap]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Input
          icon="search"
          placeholder="Filter cards..."
          value={searchTerm}
          onChange={(e, { value }) => setSearchTerm(value)}
          size="small"
        />
        <div className={styles.stats}>
          Showing {filteredAndSortedCards.length} of {cards.length} cards
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table celled selectable compact sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={sortField === 'name' ? (sortAsc ? 'ascending' : 'descending') : null}
                onClick={() => handleSort('name')}
              >
                Card Title
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={sortField === 'list' ? (sortAsc ? 'ascending' : 'descending') : null}
                onClick={() => handleSort('list')}
              >
                List
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={sortField === 'dueDate' ? (sortAsc ? 'ascending' : 'descending') : null}
                onClick={() => handleSort('dueDate')}
              >
                Due Date
              </Table.HeaderCell>
              <Table.HeaderCell>Members</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredAndSortedCards.map((card) => {
              const listName = listMap[card.listId] || 'Unknown';
              const isOverdue = card.dueDate && new Date(card.dueDate) < new Date() && !card.isDueCompleted;

              return (
                <Table.Row key={card.id} onClick={() => handleCardClick(card.id)} className={styles.row}>
                  <Table.Cell className={styles.nameCell}>
                    <Icon name="file alternate outline" className={styles.cardIcon} />
                    <strong>{card.name}</strong>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={styles.listBadge}>{listName}</span>
                  </Table.Cell>
                  <Table.Cell>
                    {card.dueDate ? (
                      <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : ''}`}>
                        <Icon name="clock outline" />
                        {new Date(card.dueDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className={styles.empty}>-</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {card.creatorUserId ? userMap[card.creatorUserId] || '-' : '-'}
                  </Table.Cell>
                  <Table.Cell>
                    {card.isDueCompleted ? (
                      <span className={styles.completedBadge}>Completed</span>
                    ) : isOverdue ? (
                      <span className={styles.overdueBadge}>Overdue</span>
                    ) : (
                      <span className={styles.activeBadge}>In Progress</span>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
});

export default TableView;
