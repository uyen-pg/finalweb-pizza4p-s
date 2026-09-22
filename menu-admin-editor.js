/* No-code menu editor for Pizza 4P's school/project site. */
(function(){
  const style=document.createElement('style'); style.id='menu-admin-editor-style'; style.textContent=`
#menuAdminFab{position:fixed;right:22px;bottom:22px;z-index:100000;border:0;background:#18382e;color:#fff;border-radius:999px;padding:13px 18px;font-weight:800;box-shadow:0 10px 30px rgba(0,0,0,.22);cursor:pointer;font-family:Arial,sans-serif}
#menuAdminFab:hover{background:#b89a57}
#menuAdminOverlay{position:fixed;inset:0;background:rgba(0,0,0,.58);z-index:99999;display:none;align-items:center;justify-content:center;padding:20px;font-family:Arial,sans-serif}
#menuAdminOverlay.open{display:flex}
#menuAdminPanel{width:min(1080px,96vw);max-height:92vh;overflow:hidden;background:#fff;border-radius:20px;box-shadow:0 25px 80px rgba(0,0,0,.3);display:grid;grid-template-columns:300px 1fr}
.menuAdminSide{background:#f5f7f5;border-right:1px solid #e1e7e2;display:flex;flex-direction:column;min-height:620px}
.menuAdminHead{padding:20px;border-bottom:1px solid #e1e7e2}.menuAdminHead h2{margin:0;color:#18382e;font-size:20px}.menuAdminHead p{margin:7px 0 0;color:#718078;font-size:12px;line-height:1.5}
#menuAdminSearch{width:100%;box-sizing:border-box;margin-top:14px;padding:11px 12px;border:1px solid #d7dfd9;border-radius:10px;outline:none}
#menuAdminList{overflow:auto;padding:10px;flex:1}.menuAdminItem{display:block;width:100%;border:0;background:#fff;text-align:left;padding:11px 12px;border-radius:10px;margin-bottom:6px;cursor:pointer;color:#244238}.menuAdminItem:hover{background:#eaf1ec}.menuAdminItem.active{background:#18382e;color:#fff}.menuAdminItem small{display:block;opacity:.65;margin-top:3px;font-size:10px}
.menuAdminMain{overflow:auto;min-height:620px}.menuAdminToolbar{display:flex;justify-content:space-between;align-items:center;padding:17px 20px;border-bottom:1px solid #e5e9e6;position:sticky;top:0;background:#fff;z-index:2}.menuAdminToolbar button,.menuAdminActions button{border:0;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer}.menuAdminClose{background:#f0f2f0;color:#40544b}.menuAdminNew{background:#18382e;color:#fff}
.menuAdminForm{padding:22px}.menuAdminForm h3{margin:0 0 18px;color:#18382e;font-size:24px}.menuAdminGrid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.menuAdminField{display:flex;flex-direction:column;gap:6px}.menuAdminField.full{grid-column:1/-1}.menuAdminField label{font-size:11px;font-weight:800;color:#53655d;text-transform:uppercase;letter-spacing:.7px}.menuAdminField input,.menuAdminField textarea,.menuAdminField select{width:100%;box-sizing:border-box;border:1px solid #d7dfd9;border-radius:10px;padding:11px 12px;font:inherit;outline:none;background:#fff}.menuAdminField textarea{min-height:90px;resize:vertical}.menuAdminField input:focus,.menuAdminField textarea:focus,.menuAdminField select:focus{border-color:#7e9c8d;box-shadow:0 0 0 3px rgba(31,143,95,.08)}
.menuAdminHint{background:#f5f8f5;border:1px solid #dce7df;border-radius:12px;padding:13px;margin-bottom:18px;font-size:12px;color:#53655d;line-height:1.55}.menuAdminHint strong{color:#18382e}.menuAdminActions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}.menuAdminActions button{border:0}.menuAdminSave{background:#1f8f5f;color:#fff}.menuAdminDelete{background:#fff0f0;color:#a33;border:1px solid #f0caca!important}.menuAdminStatus{font-size:12px;color:#6c7c74;margin-right:auto;align-self:center}
@media(max-width:800px){#menuAdminPanel{grid-template-columns:1fr;max-height:94vh}.menuAdminSide{min-height:250px;max-height:300px;border-right:0;border-bottom:1px solid #e1e7e2}.menuAdminGrid{grid-template-columns:1fr}.menuAdminField.full{grid-column:auto}.menuAdminMain{min-height:0}}
`; document.head.appendChild(style);

  const html=`
<button id="menuAdminFab" type="button" title="Mở trình chỉnh sửa menu">✏️ Chỉnh sửa menu</button>
<div id="menuAdminOverlay" aria-hidden="true">
  <div id="menuAdminPanel" role="dialog" aria-modal="true" aria-label="Trình chỉnh sửa menu">
    <aside class="menuAdminSide">
      <div class="menuAdminHead">
        <h2>Quản lý nội dung</h2>
        <p>Không cần biết code. Chọn món ở bên trái rồi sửa thông tin ở bên phải.</p>
        <input id="menuAdminSearch" type="search" placeholder="Tìm tên món...">
      </div>
      <div id="menuAdminList"></div>
    </aside>
    <section class="menuAdminMain">
      <div class="menuAdminToolbar">
        <span class="menuAdminStatus" id="menuAdminStatus">Đang chỉnh sửa trên thiết bị này</span>
        <div style="display:flex;gap:8px"><button class="menuAdminNew" id="menuAdminNew" type="button">＋ Thêm món</button><button class="menuAdminClose" id="menuAdminClose" type="button">Đóng</button></div>
      </div>
      <div class="menuAdminForm">
        <div class="menuAdminHint"><strong>Ghi chú dị ứng:</strong> nhập những nguyên liệu cần tránh. <strong>Bếp Minh Bạch:</strong> nhập nguồn gốc nguyên liệu chính và ngày cập nhật để khách xem được thông tin minh bạch.</div>
        <h3 id="menuAdminTitle">Chọn một món</h3>
        <div class="menuAdminGrid">
          <div class="menuAdminField"><label>Tên món</label><input id="admName"></div>
          <div class="menuAdminField"><label>Tên tiếng Anh</label><input id="admEnName"></div>
          <div class="menuAdminField"><label>Danh mục</label><select id="admCat"><option value="pizza">Pizza</option><option value="appetizer">Khai vị</option><option value="pasta">Pasta</option><option value="main">Món chính</option><option value="dessert">Tráng miệng</option><option value="drink">Đồ uống</option><option value="other">Khác</option></select></div>
          <div class="menuAdminField"><label>Giá (VND)</label><input id="admPrice" type="number" min="0"></div>
          <div class="menuAdminField full"><label>Mô tả</label><textarea id="admDesc"></textarea></div>
          <div class="menuAdminField full"><label>Hình ảnh (URL)</label><input id="admImg" placeholder="https://.../anh-mon-an.jpg"></div>
          <div class="menuAdminField full"><label>📝 Ghi chú dị ứng / nguyên liệu cần tránh</label><textarea id="admAllergy" placeholder="Ví dụ: Có sữa, gluten. Không thêm hạt điều."></textarea></div>
          <div class="menuAdminField"><label>🍳 Nguồn gốc nguyên liệu chính</label><textarea id="admOrigin" placeholder="Ví dụ: Cà chua — Đà Lạt; phô mai — Lâm Đồng"></textarea></div>
          <div class="menuAdminField"><label>📅 Ngày cập nhật Bếp Minh Bạch</label><input id="admOriginDate" type="date"></div>
        </div>
        <div class="menuAdminActions">
          <button class="menuAdminDelete" id="menuAdminDelete" type="button">Xóa món</button>
          <button class="menuAdminSave" id="menuAdminSave" type="button">💾 Lưu nội dung</button>
        </div>
      </div>
    </section>
  </div>
</div>`;
  const wrap=document.createElement('div'); wrap.innerHTML=html; document.body.appendChild(wrap);

  const STORAGE_KEY='pizza4ps_menu_edits_v1';
  let selectedId=null,isNew=false;
  const $=id=>document.getElementById(id);
  function loadEdits(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch(e){return {}}}
  function saveEdits(){const data={};rawItems.forEach(i=>{if(i.allergyNote||i.ingredientOrigin||i.originDate||i._adminAdded)data[i.id]={allergyNote:i.allergyNote||'',ingredientOrigin:i.ingredientOrigin||'',originDate:i.originDate||'',_adminAdded:!!i._adminAdded}});localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}
  function applyEdits(){const data=loadEdits();rawItems.forEach(i=>{if(data[i.id])Object.assign(i,data[i.id])})}
  function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]))}
  function list(){
    const q=($('menuAdminSearch').value||'').toLowerCase().trim(),box=$('menuAdminList');
    box.innerHTML=rawItems.filter(i=>(i.name+' '+(i.enName||'')).toLowerCase().includes(q)).map(i=>`<button type="button" class="menuAdminItem ${String(i.id)===String(selectedId)?'active':''}" data-id="${esc(i.id)}">${esc(i.name)}<small>${esc(i.cat||'other')} · ${Number(i.price||0).toLocaleString('vi-VN')} VND</small></button>`).join('');
    box.querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.id)));
  }
  function fill(item){
    $('menuAdminTitle').textContent=item?'Chỉnh sửa: '+item.name:'Thêm món mới';
    $('admName').value=item?.name||'';$('admEnName').value=item?.enName||'';$('admCat').value=item?.cat||'other';$('admPrice').value=item?.price??'';$('admDesc').value=item?.desc||'';$('admImg').value=item?.img||'';$('admAllergy').value=item?.allergyNote||'';$('admOrigin').value=item?.ingredientOrigin||'';$('admOriginDate').value=item?.originDate||'';
    $('menuAdminDelete').style.display=item&&!isNew?'block':'none';
  }
  function select(id){selectedId=id;isNew=false;const item=rawItems.find(i=>String(i.id)===String(id));fill(item);list()}
  function newItem(){isNew=true;selectedId='new';fill(null);$('admName').focus();list()}
  function save(){
    const name=$('admName').value.trim();if(!name){alert('Bạn chưa nhập tên món.');return}
    let item;
    if(isNew){const ids=rawItems.map(i=>Number(i.id)||0);item={id:Math.max(0,...ids)+1,tags:[],priceHalf:0,_adminAdded:true};rawItems.push(item);selectedId=item.id;isNew=false}
    item=rawItems.find(i=>String(i.id)===String(selectedId));
    Object.assign(item,{name,enName:$('admEnName').value.trim()||name,cat:$('admCat').value,price:Number($('admPrice').value)||0,desc:$('admDesc').value.trim(),img:$('admImg').value.trim(),allergyNote:$('admAllergy').value.trim(),ingredientOrigin:$('admOrigin').value.trim(),originDate:$('admOriginDate').value});
    saveEdits();list();fill(item);if(typeof renderMenu==='function')renderMenu();
    $('menuAdminStatus').textContent='✓ Đã lưu trên trình duyệt này';setTimeout(()=>{$('menuAdminStatus').textContent='Đang chỉnh sửa trên thiết bị này'},1800);
  }
  function del(){
    const item=rawItems.find(i=>String(i.id)===String(selectedId));if(!item)return;
    if(!confirm('Xóa món “'+item.name+'” khỏi menu trên thiết bị này?'))return;
    const idx=rawItems.indexOf(item);if(idx>=0)rawItems.splice(idx,1);saveEdits();selectedId=null;fill(null);list();if(typeof renderMenu==='function')renderMenu()
  }
  function open(){applyEdits();$('menuAdminOverlay').classList.add('open');$('menuAdminOverlay').setAttribute('aria-hidden','false');list();if(rawItems.length)select(rawItems[0].id)}
  function close(){$('menuAdminOverlay').classList.remove('open');$('menuAdminOverlay').setAttribute('aria-hidden','true')}
  applyEdits();
  function init(){
    $('menuAdminFab').addEventListener('click',open);$('menuAdminClose').addEventListener('click',close);$('menuAdminNew').addEventListener('click',newItem);$('menuAdminSave').addEventListener('click',save);$('menuAdminDelete').addEventListener('click',del);$('menuAdminSearch').addEventListener('input',list);$('menuAdminOverlay').addEventListener('click',e=>{if(e.target===$('menuAdminOverlay'))close()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();