/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';
import { Tooltip } from '../../../../lib/custom-ui';
import { usePopup } from '../../../../lib/popup';

import selectors from '../../../../selectors';
import entryActions from '../../../../entry-actions';
import { BoardContexts, BoardViews } from '../../../../constants/Enums';
import { BoardViewIcons } from '../../../../constants/Icons';
import ActionsStep from './ActionsStep';
import AutomationsModal from '../AutomationsModal/AutomationsModal';

import styles from './RightSide.module.scss';

const TOOLTIP_BY_VIEW = {
  [BoardViews.KANBAN]: 'action.switchToKanbanView',
  [BoardViews.GRID]: 'action.switchToGridView',
  [BoardViews.LIST]: 'action.switchToListView',
  [BoardViews.CALENDAR]: 'Calendário',
  [BoardViews.TIMELINE]: 'Linha do Tempo (Gantt)',
  [BoardViews.TABLE]: 'Tabela',
  [BoardViews.DASHBOARD]: 'Dashboard Analítico',
};

const RightSide = React.memo(() => {
  const board = useSelector(selectors.selectCurrentBoard);

  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [isAutomationsOpen, setIsAutomationsOpen] = React.useState(false);

  const handleSelectViewClick = useCallback(
    ({ currentTarget: { value: view } }) => {
      dispatch(entryActions.updateViewInCurrentBoard(view));
    },
    [dispatch],
  );

  const ActionsPopup = usePopup(ActionsStep);

  const views = [BoardViews.GRID, BoardViews.LIST, BoardViews.CALENDAR, BoardViews.TIMELINE, BoardViews.TABLE, BoardViews.DASHBOARD];
  if (board.context === BoardContexts.BOARD) {
    views.unshift(BoardViews.KANBAN);
  }

  return (
    <>
      <div className={styles.action}>
        <div className={styles.buttonGroup}>
          {views.map((view) => (
            <Tooltip
              key={view}
              content={TOOLTIP_BY_VIEW[view] ? t(TOOLTIP_BY_VIEW[view]) : view}
              disabled={view === board.view}
            >
              <button
                type="button"
                value={view}
                disabled={view === board.view}
                className={styles.button}
                onClick={handleSelectViewClick}
              >
                <Icon fitted name={BoardViewIcons[view] || 'columns'} />
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className={styles.action}>
        <Tooltip content="Butler Automations">
          <button type="button" className={styles.button} onClick={() => setIsAutomationsOpen(true)}>
            <Icon fitted name="lightning" color="yellow" />
          </button>
        </Tooltip>
      </div>
      <div className={styles.action}>
        <ActionsPopup>
          <Tooltip content={t('common.openBoardActions')}>
            <button type="button" className={styles.button}>
              <Icon fitted name="ellipsis vertical" />
            </button>
          </Tooltip>
        </ActionsPopup>
      </div>
      <AutomationsModal isOpen={isAutomationsOpen} onClose={() => setIsAutomationsOpen(false)} />
    </>
  );
});

export default RightSide;
