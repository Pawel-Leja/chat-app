if [ -z "$1" ]; then
    echo "You need to provide function name as first argument";
    exit;
fi

FILE="$1.zip"

mkdir -p _build
rm -f ./_build/$FILE
cd $1/
ls
zip --symlinks -r ../$FILE ./*
cd ..
mv $FILE ./_build
