package diamond_shop.diamond_shop.config;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/account/**")
                .allowedOrigins("*")  
                .allowedMethods("POST", "GET", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
