import sys
f = open(sys.argv[1])
str = f.read()
import re
str = '{'+str[1:len(str)-2]+'}'
str = re.sub(r'{"id":("[^"]+"),',r'\1:{',str)
f.close()
f = open(sys.argv[1],'w')
f.write(str)
f.close()
raw_input("")