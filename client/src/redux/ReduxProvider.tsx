'use client';

import { Provider } from 'react-redux';

import React from 'react';

import store from './store';

interface IReduxProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: IReduxProps) {
  return <Provider store={store}>{children}</Provider>;
}
