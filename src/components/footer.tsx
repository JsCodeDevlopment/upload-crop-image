const Footer = () => {
  return (
    <footer className="relative z-10 w-full bg-[#020617] border-t border-gray-800/50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Brand/Inspiration */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Image Crop <span className="text-blue-500">Field</span>
            </h3>
            <p className="text-gray-400 max-w-sm">
              Criado para simplificar a experiência de upload e edição de imagens em aplicações modernas.
            </p>
          </div>

          {/* Social/Links */}
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-4">
              <a
                href="https://github.com/JsCodeDevlopment"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300"
                title="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/jscodedevelopment"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300"
                title="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href="mailto:jonatasilva118@gmail.com"
                className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300"
                title="Email"
              >
                <EmailIcon />
              </a>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
              Built with ❤️ by <span className="text-gray-300">Jonatas Silva</span>
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Image Crop Field. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <span className="hover:text-blue-400 transition-colors cursor-pointer">Licença MIT</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer">Documentação</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 11.388-11.387z"/></svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
);

export default Footer;
