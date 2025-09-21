import { useState, useEffect, useCallback, useRef } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface AsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for handling async operations with loading, error, and data states
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: AsyncOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunction();
      
      if (mountedRef.current) {
        setState({ data, loading: false, error: null });
        onSuccess?.(data);
      }
      
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      if (mountedRef.current) {
        setState({ data: null, loading: false, error: err });
        onError?.(err);
      }
      
      throw err;
    }
  }, [asyncFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for handling async operations that can be triggered manually
 */
export function useAsyncCallback<T, Args extends any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: AsyncOptions = {}
) {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: Args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunction(...args);
      
      if (mountedRef.current) {
        setState({ data, loading: false, error: null });
        onSuccess?.(data);
      }
      
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      if (mountedRef.current) {
        setState({ data: null, loading: false, error: err });
        onError?.(err);
      }
      
      throw err;
    }
  }, [asyncFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for handling multiple async operations
 */
export function useAsyncMultiple<T extends Record<string, any>>(
  asyncFunctions: { [K in keyof T]: () => Promise<T[K]> },
  dependencies: React.DependencyList = [],
  options: AsyncOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<{
    data: Partial<T>;
    loading: boolean;
    error: Error | null;
    loadingStates: { [K in keyof T]?: boolean };
    errors: { [K in keyof T]?: Error };
  }>({
    data: {},
    loading: false,
    error: null,
    loadingStates: {},
    errors: {},
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    const keys = Object.keys(asyncFunctions) as (keyof T)[];
    
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      loadingStates: keys.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      errors: {},
    }));

    const results: Partial<T> = {};
    const errors: { [K in keyof T]?: Error } = {};
    let hasError = false;

    await Promise.allSettled(
      keys.map(async (key) => {
        try {
          const result = await asyncFunctions[key]();
          results[key] = result;
          
          if (mountedRef.current) {
            setState(prev => ({
              ...prev,
              data: { ...prev.data, [key]: result },
              loadingStates: { ...prev.loadingStates, [key]: false },
            }));
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          errors[key] = err;
          hasError = true;
          
          if (mountedRef.current) {
            setState(prev => ({
              ...prev,
              errors: { ...prev.errors, [key]: err },
              loadingStates: { ...prev.loadingStates, [key]: false },
            }));
          }
        }
      })
    );

    if (mountedRef.current) {
      const finalError = hasError ? new Error('One or more operations failed') : null;
      setState(prev => ({
        ...prev,
        loading: false,
        error: finalError,
      }));

      if (hasError) {
        onError?.(finalError!);
      } else {
        onSuccess?.(results);
      }
    }

    return { data: results, errors };
  }, [asyncFunctions, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: {},
      loading: false,
      error: null,
      loadingStates: {},
      errors: {},
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for handling retry logic with exponential backoff
 */
export function useAsyncRetry<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: AsyncOptions & {
    maxRetries?: number;
    retryDelay?: number;
    backoffMultiplier?: number;
  } = {}
) {
  const {
    immediate = true,
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<AsyncState<T> & { retryCount: number }>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const executeWithRetry = useCallback(async (retryCount = 0): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null, retryCount }));

    try {
      const data = await asyncFunction();
      
      if (mountedRef.current) {
        setState({ data, loading: false, error: null, retryCount });
        onSuccess?.(data);
      }
      
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      if (retryCount < maxRetries) {
        const delay = retryDelay * Math.pow(backoffMultiplier, retryCount);
        
        setTimeout(() => {
          if (mountedRef.current) {
            executeWithRetry(retryCount + 1);
          }
        }, delay);
        
        return Promise.reject(err);
      } else {
        if (mountedRef.current) {
          setState({ data: null, loading: false, error: err, retryCount });
          onError?.(err);
        }
        
        throw err;
      }
    }
  }, [asyncFunction, maxRetries, retryDelay, backoffMultiplier, onSuccess, onError]);

  const retry = useCallback(() => {
    executeWithRetry(0);
  }, [executeWithRetry]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null, retryCount: 0 });
  }, []);

  useEffect(() => {
    if (immediate) {
      executeWithRetry(0);
    }
  }, dependencies);

  return {
    ...state,
    execute: executeWithRetry,
    retry,
    reset,
    canRetry: state.retryCount < maxRetries,
  };
}