const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok",{headers:corsHeaders});
  if (req.method !== "POST") return reply({error:"Method not allowed"},405);
  try {
    const auth=req.headers.get("Authorization")||"", publishableKey=req.headers.get("apikey")||"";
    if(!auth.startsWith("Bearer ")||!publishableKey.startsWith("sb_publishable_")) return reply({error:"Authentication and publishable API key are required."},401);
    const supabaseUrl=Deno.env.get("SUPABASE_URL"), openAiKey=Deno.env.get("OPENAI_API_KEY");
    if(!supabaseUrl||!openAiKey) return reply({error:"Server secrets are not configured."},500);
    const userResponse=await fetch(`${supabaseUrl}/auth/v1/user`,{headers:{apikey:publishableKey,Authorization:auth}});
    if(!userResponse.ok) return reply({error:"Invalid or expired session."},401);
    const user=await userResponse.json();
    const ownerResponse=await fetch(`${supabaseUrl}/rest/v1/factory_owner_profiles?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`,{headers:{apikey:publishableKey,Authorization:auth}});
    if(!ownerResponse.ok) return reply({error:"Could not verify factory owner access."},403);
    const ownerRows=await ownerResponse.json();
    if(!Array.isArray(ownerRows)||ownerRows.length===0) return reply({error:"Only the Artist Factory owner can analyse design images."},403);
    const body=await req.json(), image=body?.image;
    if(typeof image!=="string"||!/^data:image\/(png|jpeg|webp);base64,/.test(image)) return reply({error:"Send a PNG, JPEG or WEBP image as a base64 data URL."},400);
    if(image.length>7000000) return reply({error:"Image is too large. Maximum 5 MB."},413);
    const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{Authorization:`Bearer ${openAiKey}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4.1-mini",store:false,input:[{role:"user",content:[{type:"input_text",text:"Analisa esta imagem como referência de identidade visual para um site de artista. Devolve APENAS JSON válido com concept, mood, palette (bg, panel, accent, secondary em hex), typography (heading e body), components (header, buttons, cards, navigation, hero), layout, texture_and_shapes, accessibility_notes e css_guidance. Analisa composição, hierarquia, espaçamento, navegação, cabeçalho, hero, cartões, botões, tipografia e cores. A imagem é apenas inspiração visual: nunca recomendar remover funcionalidades, links, secções, formulários, controlos ou comportamentos existentes. Garante contraste legível e cores hex válidas."},{type:"input_image",image_url:image,detail:"high"}]}]})});
    const result=await response.json();
    if(!response.ok) return reply({error:result?.error?.message||"Image analysis failed."},502);
    const outputText=(result.output||[]).flatMap(item=>item.content||[]).find(item=>item.type==="output_text")?.text;
    if(!outputText) return reply({error:"AI returned no design analysis."},502);
    let design; try{design=JSON.parse(outputText)}catch{return reply({error:"AI returned an invalid design format."},502)}
    return reply({design});
  }catch(error){return reply({error:error instanceof Error?error.message:"Unexpected error."},500)}
});
function reply(data,status=200){return new Response(JSON.stringify(data),{status,headers:{...corsHeaders,"Content-Type":"application/json"}})}
