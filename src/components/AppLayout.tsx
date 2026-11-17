import { useEffect, useRef, useState } from "react";
import { FolderKanban, MoreHorizontal, RotateCcw, X } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../store/AppContext";

export function AppLayout() {
  const { currentProject, resetData } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [menuOpen]);

  const runReset = () => {
    resetData();
    setConfirmReset(false);
    setMenuOpen(false);
    navigate("/projects");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/projects" aria-label="Project Compass - Danh sách dự án">
          <span className="brand-mark"><FolderKanban size={20} /></span>
          <span className="brand-text"><strong>Project Compass</strong><small>Biến ý tưởng thành hành động</small></span>
        </Link>
        {currentProject && location.pathname.includes("/projects/") && (
          <div className="current-project"><span>Dự án hiện tại</span><strong>{currentProject.name}</strong></div>
        )}
        <nav className="header-actions" aria-label="Điều hướng chung">
          <Link className="header-link" to="/projects">Danh sách dự án</Link>
          <div className="menu-wrap" ref={menuRef}>
            <button className="icon-button" type="button" aria-label="Mở menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><MoreHorizontal /></button>
            {menuOpen && (
              <div className="menu-popover">
                <button type="button" onClick={() => setConfirmReset(true)}><RotateCcw size={16} /> Đặt lại dữ liệu</button>
              </div>
            )}
          </div>
        </nav>
      </header>
      <Outlet />
      {confirmReset && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && setConfirmReset(false)}>
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title">
            <button className="dialog-close" type="button" aria-label="Đóng" onClick={() => setConfirmReset(false)}><X /></button>
            <span className="dialog-icon warning"><RotateCcw /></span>
            <h2 id="reset-title">Đặt lại dữ liệu?</h2>
            <p>Tất cả thay đổi hiện tại sẽ bị xóa và dữ liệu ban đầu sẽ được khôi phục.</p>
            <div className="dialog-actions"><button className="button secondary" type="button" onClick={() => setConfirmReset(false)}>Hủy</button><button className="button danger" type="button" onClick={runReset}>Đặt lại</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
