#!/usr/bin/env bash

# package studio as one rpm and tar.gz
# 1.将 pack_CentOS.sh 拷贝至 nebula-studio-gin 源代码上一层目录
# 2.注意将example-config.yaml中的port配置的注释打开
# 3.执行 pack_CentOS.sh (依赖 gcc cmack, 参考README.md)
# 4.rpm包在 package/tmp 里


set -ex

DIR=`pwd`
STUDIO=$DIR/nebula-studio-gin

cd $STUDIO
VERSION=`cat package.json | grep '"version":' | awk 'NR==1{print $2}' | awk -F'"' '{print $2}'`

# build rpm target dir
RPM_TARGET=$DIR/package
mkdir -p $RPM_TARGET/scripts

# 执行 cp -rf 其实就是 cp -i -rf, alias cp=’cp -i’, 可以直接调用/bin/cp, 不再提示覆盖问题
# cp -rf $STUDIO/scripts/rpm $RPM_TARGET/scripts/
/bin/cp -rf $STUDIO/scripts/rpm/* $RPM_TARGET/scripts/
mv $RPM_TARGET/scripts/CMakeLists.txt $RPM_TARGET/

cp -r $STUDIO/server/config $RPM_TARGET/
cp -r $STUDIO/server/server $RPM_TARGET/

cd $RPM_TARGET
cp CMakeLists.txt tmp
mkdir -p tmp
cmake . -B ./tmp
cd ./tmp
cpack -G RPM
ls -a

# build target dir, 暂时不需要tar包, 先注释掉
#TAR_TARGET=$DIR/nebula-graph-studio
#mkdir -p $TAR_TARGET

#cp -r $STUDIO/server/config $TAR_TARGET/
#cp -r $STUDIO/server/server $TAR_TARGET/

#cd $DIR
#tar -czf nebula-graph-studio-$VERSION.x86_64.tar.gz nebula-graph-studio