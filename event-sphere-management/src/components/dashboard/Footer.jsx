const Footer = () => {
  return (
    <footer className="footer">
      <div className="d-sm-flex justify-content-center justify-content-sm-between py-2">
        <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">
          Copyright © EventSphere Management {new Date().getFullYear()}
        </span>
        <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
          Event Management System
        </span>
      </div>
    </footer>
  )
}

export default Footer

