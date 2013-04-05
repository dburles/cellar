# Meteor.startup ->

# 	doresize = ->
# 		$('#list th').each (index) ->
# 			width = $(this).width()
# 			$('#header-fixed th').eq(index).css('width', width + 'px')

# 	tableOffset = $("#list").offset().top
# 	$header = $("#list > thead").clone()
# 	$fixedHeader = $("#header-fixed").append($header)

# 	$(window).bind "scroll", ->
# 		offset = $(this).scrollTop()

# 		if offset >= tableOffset && $fixedHeader.is(":hidden")
# 			$fixedHeader.show()
# 			doresize()

# 		else if offset < tableOffset
# 			$fixedHeader.hide()

# 	$(window).resize ->
# 		doresize()
