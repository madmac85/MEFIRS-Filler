# MEFIRS-Filler
Extension for auto selecting/filling buttons and options for imagetrend.

This is a project I've been working on intermittenly for a few years now.
Takes some preselected values and automatically chooses them. 

Imagetrend uses a weird process with knockoutJS that causes some traditional methods to fail. You'll see quite a few bypasses/methods to make all of this work.

Most of the extension is based around the content script injecting JS into the page. Otherwise there are a couple functions to translate data back and forth from Imagetrend to the popup.html page.

Currently only works on the Maine version of Imagetrend, but it's all built the same and should work with a little tweaking and permissions on other agencies.
