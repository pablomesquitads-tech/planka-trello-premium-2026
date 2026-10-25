/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React from 'react';
import { Image, Tab } from 'semantic-ui-react';

import version from '../../../version';

import aboutLogo from '../../../assets/images/about-logo.png';

import styles from './AboutPane.module.scss';

const AboutPane = React.memo(() => (
  <Tab.Pane attached={false} className={styles.wrapper}>
    <Image centered src={aboutLogo} size="medium" />
    <div className={styles.version}>v{version}</div>
  </Tab.Pane>
));

export default AboutPane;
