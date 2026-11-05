import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { openThreadX } from './threadx'

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex h-full items-center justify-center" role="status" aria-label={label}>
      <div className="size-9 animate-spin rounded-full border-4 border-primary/25 border-t-primary" />
    </div>
  )
}

export function PrimaryButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-lg bg-primary px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-primary-dark focus-visible:bg-primary-dark disabled:bg-primary/50 disabled:text-white/60 ${className}`}
    />
  )
}

export function TextButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-[15px] font-medium text-primary hover:bg-primary/10 ${className}`}
    />
  )
}

/** A centered message card on the LMS light background, used for every gate state but success. */
export function Notice(props: {
  title: string
  body: ReactNode
  action: string
  onAction?: () => void
  onRetry?: () => void
}) {
  return (
    <main className="flex h-full items-center justify-center bg-app-bg p-5">
      <div className="flex w-full max-w-[400px] flex-col items-stretch text-center">
        <h1 className="text-2xl font-bold">{props.title}</h1>
        <p className="mt-4">{props.body}</p>
        <PrimaryButton className="mt-8" onClick={props.onAction ?? openThreadX}>
          {props.action}
        </PrimaryButton>
        {props.onRetry && (
          <TextButton className="mt-3" onClick={props.onRetry}>
            Try again
          </TextButton>
        )}
      </div>
    </main>
  )
}
