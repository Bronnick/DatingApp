import { NumberSymbol } from "@angular/common"

export type ApiError = {
    message: string
    statusCode: number,
    details?: string
}