'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'

export const PasswordInput = React.forwardRef(({ ...props }, ref) => {
    const [show, setShow] = React.useState(false)

    return (
        <div className="relative">
            <Input
                type={show ? 'text' : 'password'}
                ref={ref}
                {...props}
                
            />
            <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute right-2 top-2.5 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                tabIndex={-1}
            >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    )
})

PasswordInput.displayName = 'PasswordInput'
