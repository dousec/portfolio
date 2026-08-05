export type Variant =
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'loading';

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  variant?: Variant;
  duration?: number;
  onClose?: () => void;
  onRemove?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface PromiseStateOption {
  title?: string;
  description?: string;
  duration?: number;
}

export type PromiseStateValue<T> =
  | string
  | PromiseStateOption
  | ((data: T) => string | PromiseStateOption);

export interface PromiseOptions<T, E = Error> {
  loading: string | PromiseStateOption;
  success: PromiseStateValue<T>;
  error: PromiseStateValue<E>;
}

interface ToastManager {
  add(options: ToastOptions): string;
  update(id: string, options: Partial<ToastOptions>): void;
  close(id: string): void;
  closeAll(): void;
}

function getManager(): ToastManager | null {
  if (typeof window === 'undefined') return null;
  return (window as any).__starwind__.toast as ToastManager | null;
}

function normalizeOption<T>(
  value:
    | string
    | PromiseStateOption
    | ((data: T) => string | PromiseStateOption),
  data?: T,
): Omit<ToastOptions, 'variant'> {
  const resolved = typeof value === 'function' ? value(data as T) : value;
  if (typeof resolved === 'string') {
    return { title: resolved };
  }
  return resolved;
}

function createToast(
  messageOrOptions: string | ToastOptions,
  extraOptions?: Omit<ToastOptions, 'title'>,
): string {
  let options: ToastOptions;
  if (typeof messageOrOptions === 'string') {
    options = { title: messageOrOptions, ...extraOptions };
  } else {
    options = messageOrOptions;
  }

  const manager = getManager();
  if (manager) {
    return manager.add(options);
  }

  console.warn('Toast: No Toaster found. Add <Toaster /> to your layout.');
  return '';
}

function createVariantToast(
  variant: Variant,
  message: string,
  options?: Omit<ToastOptions, 'variant'>,
): string {
  return createToast({ ...options, title: message, variant });
}

interface ToastAPI {
  (message: string, options?: Omit<ToastOptions, 'title'>): string;
  (options: ToastOptions): string;
  success(message: string, options?: Omit<ToastOptions, 'variant'>): string;
  error(message: string, options?: Omit<ToastOptions, 'variant'>): string;
  warning(message: string, options?: Omit<ToastOptions, 'variant'>): string;
  info(message: string, options?: Omit<ToastOptions, 'variant'>): string;
  loading(message: string, options?: Omit<ToastOptions, 'variant'>): string;
  promise<T, E = Error>(
    promise: Promise<T>,
    options: PromiseOptions<T, E>,
  ): Promise<T>;
  update(id: string, options: Partial<ToastOptions>): void;
  dismiss(id?: string): void;
}

const toast = createToast as ToastAPI;

toast.success = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  createVariantToast('success', message, options);

toast.error = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  createVariantToast('error', message, options);

toast.warning = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  createVariantToast('warning', message, options);

toast.info = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  createVariantToast('info', message, options);

toast.loading = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  createVariantToast('loading', message, { ...options, duration: 0 });

toast.promise = async <T, E = Error>(
  promise: Promise<T>,
  options: PromiseOptions<T, E>,
): Promise<T> => {
  const loadingOpts = normalizeOption(options.loading);
  const id = createToast({
    ...loadingOpts,
    variant: 'loading',
    duration: 0,
  });

  try {
    const data = await promise;
    const successOpts = normalizeOption(options.success, data);
    toast.update(id, { ...successOpts, variant: 'success' });
    return data;
  } catch (error) {
    const errorOpts = normalizeOption(options.error, error as E);
    toast.update(id, { ...errorOpts, variant: 'error' });
    throw error;
  }
};

toast.update = (id: string, options: Partial<ToastOptions>): void => {
  const manager = getManager();
  if (manager) {
    manager.update(id, options);
  } else {
    console.warn('Toast: No Toaster found. Add <Toaster /> to your layout.');
  }
};

toast.dismiss = (id?: string): void => {
  const manager = getManager();
  if (!manager) {
    return;
  }
  if (id) {
    manager.close(id);
  } else {
    manager.closeAll();
  }
};

export { toast };
