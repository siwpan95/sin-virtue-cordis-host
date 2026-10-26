import zipfile, shutil
src = r'G:\local\12test\如果从原创的角度出发，这样的测试可以如何设计.docx'
tmp = r'G:\local\12test\_docgen\fixed.docx'
zin = zipfile.ZipFile(src, 'r')
data = zin.read('word/document.xml').decode('utf-8')
n = data.count('<0/>')
data = data.replace('<0/>', '')
zout = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
for item in zin.infolist():
    if item.filename == 'word/document.xml':
        zout.writestr(item, data)
    else:
        zout.writestr(item, zin.read(item.filename))
zin.close()
zout.close()
shutil.move(tmp, src)
print('removed', n, 'invalid <0/> nodes')
