import type { User } from "./userTypes"
import type { Game } from "./gameTypes"

export interface WishlistItem {
    wishlistItemId: number
    addedAt: string
    user: User
    game: Game
}