import Script from "next/script";

/**
 * Meta Pixel + GA4. Her ikisi de env değişkeniyle guard'lı:
 * ID tanımlı değilse hiçbir script yüklenmez (mevcut sayfalar etkilenmez).
 * .env.local: NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GA_ID
 */
export default function Analytics() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  // GA ölçüm kimliği halka açık bir değerdir; env yoksa gerçek kimliğe düşer
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-7JD8Y701H5";

  return (
    <>
      {pixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
    </>
  );
}
