import { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

function Map() {
  useEffect(() => {
    const scriptId = "kakao-map-script";

    const loadScript = () => {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=e7a46d1dbe1884c8a5c68382c0ef92a7&autoload=false";
      script.async = true;

      script.onload = () => {
        console.log("✅ 카카오 SDK 로드됨");
        loadMap();
      };

      script.onerror = () => {
        console.error("❌ SDK 로드 실패");
      };

      document.head.appendChild(script);
    };

    const loadMap = () => {
      if (!window.kakao) {
        console.error("❌ window.kakao 없음");
        return;
      }

      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        if (!container) {
          console.error("❌ map div 없음");
          return;
        }

        const options = {
          center: new window.kakao.maps.LatLng(35.8919, 128.6103),
          level: 3
        };

        new window.kakao.maps.Map(container, options);
        console.log("✅ 지도 생성 완료");
      });
    };

    if (!document.getElementById(scriptId)) {
      loadScript();
    } else {
      loadMap();
    }
  }, []);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "12px"
      }}
    />
  );
}

export default Map;
