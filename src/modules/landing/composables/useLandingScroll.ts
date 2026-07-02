/**
 * Shared smooth-scroll composable for landing page anchor links.
 * Usage: const { scrollTo } = useLandingScroll()
 */
export function useLandingScroll() {
    function scrollTo(id: string) {
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return { scrollTo }
}
