function(doc) {
  emit(
    [doc.type, doc.mtime].join('-'),
    {_rev: doc._rev, title: doc.title, mtime: doc.mtime, tags: doc.tags}
  );
}
