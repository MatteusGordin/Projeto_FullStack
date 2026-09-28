package br.com.nexusti.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class FiltroCorsNativo extends OncePerRequestFilter {

    @Value("${CORS_ALLOWED_ORIGINS:http://localhost:3000,http://localhost:5173}")
    private String origensPermitidas;

    @Override
    protected void doFilterInternal(HttpServletRequest requisicao, HttpServletResponse resposta, FilterChain cadeia) throws ServletException, IOException {
        String origem = requisicao.getHeader("Origin");
        if (origem == null || origem.isEmpty()) {
            cadeia.doFilter(requisicao, resposta);
            return;
        }
        List<String> permitidas = Arrays.stream(origensPermitidas.split(","))
                .map(String::trim)
                .filter(valor -> !valor.isEmpty())
                .collect(Collectors.toList());
        String correspondente = encontrarCorrespondente(origem, permitidas);
        if (correspondente == null) {
            cadeia.doFilter(requisicao, resposta);
            return;
        }
        resposta.setHeader("Access-Control-Allow-Origin", correspondente);
        resposta.setHeader("Vary", "Origin");
        resposta.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resposta.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Origin, X-Requested-With");
        resposta.setHeader("Access-Control-Expose-Headers", "Authorization");
        resposta.setHeader("Access-Control-Allow-Credentials", "true");
        resposta.setHeader("Access-Control-Max-Age", "3600");
        String metodo = requisicao.getMethod();
        if (metodo != null && metodo.equalsIgnoreCase("OPTIONS")) {
            resposta.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        cadeia.doFilter(requisicao, resposta);
    }

    private String encontrarCorrespondente(String origem, List<String> permitidas) {
        for (String padrao : permitidas) {
            if (padrao.equals("*")) {
                return origem;
            }
            if (padrao.equals(origem)) {
                return origem;
            }
            if (padrao.contains("*")) {
                String expressao = padrao.replace(".", "\\.").replace("*", ".*");
                if (origem.matches(expressao)) {
                    return origem;
                }
            }
        }
        return null;
    }
}
