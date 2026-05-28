export function AdPlacementPolicy() {
  return (
    <section className="adPolicy card" aria-label="Advertising placement policy">
      <span className="adLabel">广告策略</span>
      <h2>广告只放在有正文内容的页面区域</h2>
      <p>
        为符合 Google AdSense 对“发布商内容”的要求，Wolffy 不在空结果、错误提示、弹窗、搜索框首屏或纯导航区域展示广告。
        如果后续启用广告单元，请放在教程正文、说明模块或真实查询结果之后，并保留清晰的广告标识。
      </p>
    </section>
  );
}
