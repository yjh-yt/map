'use client';
import { useEffect, useRef } from 'react';

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    // 加载高德JS API
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${process.env.NEXT_PUBLIC_AMAP_KEY}&plugin=AMap.Scale,AMap.ToolBar`;
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      const map = new window.AMap.Map(mapRef.current, {
        zoom: 12,
        center: [121.473701, 31.230416], // 默认上海，你可以改成烟台 121.44,37.46
      });
      // 添加比例尺、工具栏控件
      // @ts-ignore
      map.addControl(new window.AMap.Scale());
      // @ts-ignore
      map.addControl(new window.AMap.ToolBar());

      // 点击地图添加标记点
      // @ts-ignore
      map.on('click', (e) => {
        // @ts-ignore
        new window.AMap.Marker({
          position: e.lnglat,
          map: map
        })
      })
    }
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div style={{padding:"20px"}}>
      <h1>高德地图页面</h1>
      <a href="/">← 返回首页</a>
      <div ref={mapRef} style={{width:"100%",height:"600px",border:"1px solid #ccc",marginTop:"10px"}}></div>
      <p>点击地图任意位置，添加标记点位</p>
    </div>
  )
}
