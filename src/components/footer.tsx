const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 py-8 mt-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Desenvolvido por Jonatas Silva
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <span>✉️</span>
              <span className="font-medium">Email:</span>
              <a
                href="mailto:jonatasilva118@gmail.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                jonatasilva118@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/jscodedevelopment"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                🔗 LinkedIn
              </a>

              <a
                href="https://github.com/JsCodeDevlopment"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                🔗 GitHub
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} - Componente de Upload e Recorte de
              Imagens
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
