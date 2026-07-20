# UI design memory

New UI elements must follow the existing DeskClerk visual system. Reuse the established theme tokens, spacing, border radii, button treatments, icon assets, active states, and layout patterns from neighboring views. Do not introduce generic boilerplate controls, browser-default-looking widgets, arbitrary colors, or one-off visual treatments without a clear existing precedent.

For repeated controls such as project scope toggles, use the shared segmented-toggle appearance and keep state local to the view/sidebar that owns the control. Do not reuse a global store when it causes one view's control to change another view's scope.
