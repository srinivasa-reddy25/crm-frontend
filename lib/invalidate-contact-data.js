// Refresh cached dashboard data even when its page is not currently mounted.
export function invalidateContactData(queryClient) {
  return Promise.all(['contacts', 'contact', 'tags', 'dashboard-summary', 'contacts-by-company', 'tag-distribution', 'activities', 'activities-timeline'].map(key =>
    queryClient.invalidateQueries({ queryKey: [key], refetchType: 'all' })
  ));
}
