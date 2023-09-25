#### Saving jquery value as data-id:
    target_input.data('id', row?._row?.data?.id)
    target_input.attr('data-id', row?._row?.data?.id)

The `attr` makes sure that we can see data-id in the DOM inspector
