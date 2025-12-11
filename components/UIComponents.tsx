// components/UIComponents.tsx
// Production-ready component library for EzyVoting redesign

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ===================== BUTTON COMPONENT =====================

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
  icon,
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-[#0F172E] hover:shadow-glow active:scale-95 focus:ring-[#00D4FF]',
    secondary: 'border-2 border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF]/10 active:scale-95 focus:ring-[#00D4FF]',
    danger: 'bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white hover:shadow-lg active:scale-95 focus:ring-[#EF4444]',
    ghost: 'text-[#8B94A5] hover:text-[#00D4FF] hover:bg-[#00D4FF]/5 focus:ring-[#00D4FF]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
};

// ===================== INPUT COMPONENT =====================

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  icon,
  hint,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B94A5] group-focus-within:text-[#00D4FF] transition-colors">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-3
            ${icon ? 'pl-12' : ''}
            bg-[#1A2B5C]/50
            border border-[#2D3748]
            rounded-lg
            text-white placeholder:text-[#8B94A5]
            focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30
            transition-all duration-200
            outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 ring-2 ring-red-500/20' : ''}
            ${className}
          `}
        />
        
        {/* Animated underline */}
        <div className="
          absolute bottom-0 left-0 right-0 h-0.5
          bg-gradient-to-r from-[#00D4FF] to-transparent
          scale-x-0 group-focus-within:scale-x-100
          transition-transform duration-300 rounded-full
          origin-left
        " />
      </div>
      
      {hint && !error && (
        <p className="mt-1 text-xs text-[#8B94A5]">
          💡 {hint}
        </p>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

// ===================== SELECT COMPONENT =====================

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-3 pr-12
          bg-[#1A2B5C]/50
          border border-[#2D3748]
          rounded-lg
          text-white
          focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30
          cursor-pointer
          appearance-none
          transition-all duration-200
          outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 ring-2 ring-red-500/20' : ''}
          ${className}
        `}
        style={{
          backgroundImage: `url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e')`,
          backgroundPosition: 'right 12px center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '20px',
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

// ===================== CHECKBOX COMPONENT =====================

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  error,
  disabled = false,
  className = '',
}) => {
  return (
    <div>
      <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="
            w-5 h-5 rounded
            bg-[#1A2B5C] border-2 border-[#2D3748]
            checked:bg-gradient-to-r checked:from-[#00D4FF] checked:to-[#0099CC]
            checked:border-transparent
            cursor-pointer
            transition-all duration-200
            accent-[#00D4FF]
          "
        />
        <span className="text-white text-base">{label}</span>
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-500 ml-8 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

// ===================== CARD COMPONENT =====================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  hover?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  interactive = false,
  hover = true,
  gradient = false,
}) => {
  return (
    <motion.div
      whileHover={interactive && hover ? { y: -4 } : {}}
      className={`
        bg-[#1A2B5C]/40
        backdrop-blur-xl
        border border-white/10
        rounded-xl
        p-6
        transition-all duration-300
        ${hover ? 'hover:bg-[#1A2B5C]/60 hover:border-[#00D4FF]/30 hover:shadow-lg' : ''}
        ${gradient ? 'bg-gradient-to-br from-[#1A2B5C]/60 to-[#0F172E]/40' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

// ===================== STATUS BADGE =====================

interface BadgeProps {
  type: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, children, className = '' }) => {
  const typeStyles = {
    success: 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]',
    warning: 'bg-[#F59E0B]/20 border-[#F59E0B]/50 text-[#F59E0B]',
    error: 'bg-[#EF4444]/20 border-[#EF4444]/50 text-[#EF4444]',
    info: 'bg-[#3B82F6]/20 border-[#3B82F6]/50 text-[#3B82F6]',
  };

  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className={`
      inline-flex items-center gap-2
      px-3 py-1.5
      border rounded-full
      text-sm font-medium
      ${typeStyles[type]}
      ${className}
    `}>
      <span>{icons[type]}</span>
      {children}
    </div>
  );
};

// ===================== SPINNER =====================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`
      border-3 border-[#1A2B5C] border-t-[#00D4FF]
      rounded-full
      animate-spin
      ${sizeClasses[size]}
      ${className}
    `} />
  );
};

// ===================== TOAST/ALERT =====================

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onClose?.(), duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-gradient-to-r from-[#10B981] to-[#059669] border-[#10B981]/30',
    error: 'bg-gradient-to-r from-[#EF4444] to-[#DC2626] border-[#EF4444]/30',
    info: 'bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] border-[#3B82F6]/30',
    warning: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] border-[#F59E0B]/30',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`
        flex items-center gap-3
        px-4 py-3
        border rounded-lg
        text-white text-sm font-medium
        shadow-lg
        ${typeStyles[type]}
      `}
    >
      <span className="text-lg flex-shrink-0">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white/60 hover:text-white transition-colors flex-shrink-0"
      >
        ×
      </button>
    </motion.div>
  );
};

// ===================== TOAST CONTAINER =====================

interface ToastMessage extends ToastProps {
  id: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => (
  <div className="fixed bottom-4 right-4 space-y-3 z-50 pointer-events-none">
    <AnimatePresence>
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            {...toast}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </AnimatePresence>
  </div>
);

// ===================== MODAL =====================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                bg-gradient-to-br from-[#1A2B5C] to-[#0F172E]
                border border-white/10
                rounded-2xl
                shadow-2xl
                w-full
                pointer-events-auto
                ${sizeClasses[size]}
              `}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-4 flex items-start justify-between">
                {title && (
                  <h2 className="text-2xl font-bold text-white flex-1">
                    {title}
                  </h2>
                )}
                <button
                  onClick={onClose}
                  className="text-[#8B94A5] hover:text-white transition-colors text-2xl leading-none flex-shrink-0"
                >
                  ×
                </button>
              </div>
              
              {/* Content */}
              <div className="px-8 py-4 text-gray-200 overflow-y-auto max-h-[60vh]">
                {children}
              </div>
              
              {/* Footer */}
              {footer && (
                <div className="px-8 py-4 border-t border-white/10 flex gap-3 justify-end">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// ===================== STEPPER =====================

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            {/* Circle */}
            <motion.button
              onClick={() => onStepClick?.(idx)}
              disabled={!onStepClick}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                transition-all duration-300
                ${idx <= currentStep
                  ? 'bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-[#0F172E]'
                  : 'bg-[#2D3748] text-[#8B94A5]'
                }
                ${onStepClick ? 'cursor-pointer hover:shadow-glow' : 'cursor-default'}
              `}
            >
              {idx < currentStep ? '✓' : idx + 1}
            </motion.button>
            
            {/* Label */}
            <p className={`
              mt-2 text-sm font-medium
              ${idx <= currentStep ? 'text-white' : 'text-[#8B94A5]'}
            `}>
              {step}
            </p>
            
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: idx < currentStep ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className={`
                  absolute w-12 h-0.5 top-5
                  ${idx < currentStep
                    ? 'bg-gradient-to-r from-[#00D4FF] to-[#0099CC]'
                    : 'bg-[#2D3748]'
                  }
                `}
                style={{ left: `calc(50% + 20px)` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ===================== VERIFICATION BADGE =====================

export const VerificationBadge: React.FC<{ txHash?: string }> = ({ txHash }) => (
  <div className="flex items-center gap-2 px-4 py-3 bg-[#10B981]/20 border border-[#10B981]/50 rounded-lg text-[#10B981] text-sm">
    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    <div className="flex-1">
      <p className="font-semibold">Verified on Blockchain</p>
      {txHash && <p className="text-xs opacity-80 font-mono">{txHash.slice(0, 10)}...{txHash.slice(-8)}</p>}
    </div>
  </div>
);

export default {
  Button,
  Input,
  Select,
  Checkbox,
  Card,
  Badge,
  Spinner,
  Toast,
  ToastContainer,
  Modal,
  Stepper,
  VerificationBadge,
};
