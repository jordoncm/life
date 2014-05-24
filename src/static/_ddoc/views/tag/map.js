function(doc) {
  if(doc.tags) {
    for(var i = 0; i < doc.tags.length; i++) {
      emit(
        [doc.type, doc.tags[i], doc.mtime].join('-'),
        {_rev: doc._rev, title: doc.title, mtime: doc.mtime, tags: doc.tags}
      );
    }
  }
}
