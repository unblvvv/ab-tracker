/**
 * Typed Redux hooks
 * Provides type-safe versions of useDispatch and useSelector
 */

import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../store'

/**
 * Typed version of useDispatch hook
 * Use this instead of the plain useDispatch from react-redux
 */
export const useAppDispatch: () => AppDispatch = useDispatch

/**
 * Typed version of useSelector hook
 * Use this instead of the plain useSelector from react-redux
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
