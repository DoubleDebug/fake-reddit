import { User } from 'firebase/auth';

export function validateReport(
    user: User | null | undefined,
    violations: string[] | undefined
): ResponseStatus {
    if (!user) {
        return {
            success: false,
            message: 'Failed to submit the report. Please sign in first.',
        };
    }

    if (!violations || violations.length === 0) {
        return {
            success: false,
            message:
                'Failed to submit the report. You must select at least one violation.',
        };
    }

    return {
        success: true,
    };
}
