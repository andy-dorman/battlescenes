U=$1
P=$( echo "$U" | perl -MURI -le 'chomp($url = <>); print URI->new($url)->fragment' )
if [ -z $P ]; then
    P="//index"
fi
final_url=$U
echo $final_url
P=${P:1}
echo $P
final_path=./snapshots$P.html
phantomjs phantomjs-runner.js $final_url > $final_path
