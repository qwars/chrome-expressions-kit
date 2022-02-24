# Chrome Extension Hot Reloader

const Chrome = global:chrome

const ChromeTabsQuerySettings =
	active: true
	lastFocusedWindow: true

const filterEntriesName = do $1.name[0] !== '.'

const timestampForFilesInDirectory = do filesInDirectory($1).then do $1.map( do $1.name + $1:lastModifiedDate ).join

const filesInDirectory = do Promise.new do dir:createReader.readEntries do Promise.all( $1.filter(filterEntriesName).map( do|item| item.isDirectory ? filesInDirectory(item) : Promise.new do item.file $1 ) ).then( do $1.slice ).then $1

const watchChanges = do|dir, lastTimestamp| timestampForFilesInDirectory(dir).then do|timestamp|
	if !lastTimestamp || lastTimestamp === timestamp then setTimeout(&, 1000) do watchChanges dir, timestamp
	else chrome:runtime.reload

Chrome:management.getSelf do
	if $1:installType === 'development'
		# Chrome:runtime.getPackageDirectoryEntry do watchChanges $1
		# Chrome:tabs.query ChromeTabsQuerySettings, do chrome:tabs.reload $1[0]:id if $1[0]
