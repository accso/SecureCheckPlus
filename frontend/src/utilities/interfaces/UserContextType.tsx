export interface UserContextType {
    /**
     * The username of the user.
     */
    username: string

    /**
     * The groups of the user.
     */
    userGroups: string[]
    /**
     * Checks if the user has atleast one of the given group.
     */
    hasGroups: (groups: string[] | string) => boolean

}