mkdir -p nodejs
mkdir -p _build
rm -f ./_build/layer.zip
rm -f -r ./node_modules
yarn --production

cp -r node_modules nodejs/
zip -r layer.zip nodejs

mv layer.zip ./_build
rm -f -r ./nodejs
