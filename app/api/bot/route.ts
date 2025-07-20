import { getBot } from "@/lib/actions/bots.actions";
import { getCompanyById } from "@/lib/actions/companies.actions";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const botId = searchParams.get('bot_id') || 'default';
    const resBot = await getBot({ bot_id: botId })
    if(resBot.data){
      const resCompany = await getCompanyById({ id: resBot.data.company })
      if(resCompany.data){
        if(resCompany.data.messageCredits < 1){
          return new Response('Message Credits Exausted', { status: 500 });
        }
      }
    }

    const js = `
(function () {
  const run = () => {
    const button = document.createElement('div');
    button.innerText = '💬';
    button.style = \`
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: #333;
      color: white;
      font-size: 24px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 9999;
    \`;
    document.body.appendChild(button);

    button.onclick = function () {
      const existingFrame = document.getElementById('bot-frame');
      if (existingFrame) {
        document.body.removeChild(existingFrame);
        return;
      }
      const iframe = document.createElement('iframe');
      iframe.src = '${process.env.NEXT_PUBLIC_SERVER_URL}/embed/${botId}';
      iframe.id = 'bot-frame';

      if (window.innerWidth <= 768) { 
        // Small screens
        iframe.style = \`
          position: fixed;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 0;
          z-index: 9999;
        \`;
      } else { 
        // Large screens
        iframe.style = \`
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: 360px;
          height: 500px;
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          z-index: 9999;
        \`;
      }
      document.body.appendChild(iframe);
    };
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
`;

    return new Response(js, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Error generating bot script?', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}